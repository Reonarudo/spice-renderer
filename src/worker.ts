import { parentPort, workerData } from 'node:worker_threads';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ELK } from './elk.js';
import { loadSymbols } from './schematic.js';
import { renderNetlist } from './draw-netlist.js';
import { parserLoader } from './parser/modules.js';
import type { IncludeSet } from './netlist.js';
import { ENGINE, FAILED, HEADER, LENGTH, PARSED, READY, STARTED, type Parsed, type Reply, type Request } from './protocol.js';

const { buffer } = workerData as { buffer: SharedArrayBuffer };
const state = new Int32Array(buffer, 0, HEADER / 4);
const bytes = new Uint8Array(buffer, HEADER);

/**
 * Write the final reply at the head of the data region. It never reaches into the parsed stage at
 * the tail: a host that has timed out may be reading the tail while this worker, not yet stopped by
 * `terminate`, finishes its layout and replies (docs/adr/0001).
 */
function write(text: string, room = bytes.length - Atomics.load(state, PARSED)): number {
  const encoded = new TextEncoder().encode(text);
  if (encoded.length > room) throw new RangeError('reply exceeds the shared buffer');
  bytes.set(encoded);
  Atomics.store(state, LENGTH, encoded.length);
  return encoded.length;
}

/**
 * The parsed stage (docs/adr/0001): rows and notes at the tail of the data region, before layout begins,
 * so a worker the host terminates mid-layout still leaves them behind. Written only when it fits
 * the slack the host reserves beyond twice the output limit; otherwise `PARSED` stays 0.
 */
/** The current request's parsed stage, kept even when it did not fit the tail: every later failure carries it inline. */
let lastParsed: Parsed | undefined;
function writeParsed(parsed: Parsed, outputBytes: number): void {
  lastParsed = parsed;
  const encoded = new TextEncoder().encode(JSON.stringify(parsed));
  const slack = bytes.length - 2 * outputBytes;
  if (encoded.length > slack) return;
  bytes.set(encoded, bytes.length - encoded.length);
  Atomics.store(state, PARSED, encoded.length);
}

function reply(result: Reply): void {
  const tooLarge = { status: 'failure', message: 'the schematic is too large to return' } satisfies Reply;
  try {
    write(JSON.stringify(result));
  } catch {
    try {
      write(JSON.stringify({ ...tooLarge, ...(lastParsed ?? {}) } satisfies Reply));
    } catch {
      // Only an output limit of a few bytes leaves no room beside the tail for the plain message.
      write(JSON.stringify(tooLarge), bytes.length);
    }
  }
  Atomics.store(state, READY, 1);
  Atomics.notify(state, READY);
}

/** An ngspice netlist that touches every common symbol, drawn before the worker reports ready. */
const WARM_UP = 'V1 in 0 1\nR1 in out 1k\nC1 out 0 1u\nQ1 out in 0 npn\nM1 out in 0 0 nmos\nX1 in out box';

async function start(): Promise<(request: Request) => Promise<Reply>> {
  const symbols = loadSymbols(readFileSync(new URL('./skin/symbols.svg', import.meta.url), 'utf8'));
  const elk = new ELK();
  const layout = (graph: Parameters<typeof elk.layout>[0]) => elk.layout(graph);
  const loadParser = parserLoader(fileURLToPath(new URL('../vendor/parsers/', import.meta.url)));

  /**
   * Draw one request. The dialect's parser is loaded the first time a fence in that dialect
   * arrives; a module that will not load is a failure, not a dead worker.
   */
  const render = async ({ source, dialect, files, outputBytes }: Request): Promise<Reply> => {
    try {
      await loadParser(dialect);
    } catch {
      // The loader's message would name vendor paths on this machine.
      return { status: 'failure', message: `the ${dialect} parser could not be loaded` };
    }
    const includes: IncludeSet = {
      files: Object.fromEntries(files.map((file) => [file.key, 'text' in file ? file.text : { error: file.error }]))
    };
    lastParsed = undefined;
    const result = await renderNetlist(source, symbols, layout, includes, dialect, (parsed) => writeParsed(parsed, outputBytes));
    if (result.status === 'failure') {
      // The netlist reader counts columns from 0; the contract counts them from 1.
      return result.column === undefined ? result : { ...result, column: result.column + 1 };
    }
    if (result.status === 'success' && Buffer.byteLength(result.output) > outputBytes) {
      return { status: 'failure', message: `SPICE output exceeds the ${outputBytes}-byte limit`, ...(lastParsed ?? {}) };
    }
    return result;
  };

  // The first layout in a fresh worker costs a few hundred milliseconds of warm-up that must not
  // be charged to an author's budget, so it is spent here, before this worker reports ready.
  const warm = await render({ source: WARM_UP, dialect: 'ngspice', files: [], outputBytes: Infinity });
  if (warm.status !== 'success') throw new Error('the warm-up schematic did not draw');
  return render;
}

start().then((render) => {
  parentPort!.on('message', (request: Request) => {
    render(request).then(reply, () => {
      // An unexpected error may leave a parser's wasm instance unusable; the host discards this worker.
      // The parsed stage, when it was reached, rides along: the host never reads the tail for a failure.
      reply({ status: 'failure', message: 'the SPICE renderer stopped unexpectedly', discard: true, ...(lastParsed ?? {}) });
    });
  });
  Atomics.store(state, ENGINE, STARTED);
  Atomics.notify(state, ENGINE);
  parentPort!.postMessage('started');
}, () => {
  // The error would name vendor paths on this machine; the reason stays plain and path-free.
  write('the SPICE layout engine could not start');
  Atomics.store(state, ENGINE, FAILED);
  Atomics.notify(state, ENGINE);
  parentPort!.postMessage('failed');
});
