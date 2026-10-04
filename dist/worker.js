import { parentPort, workerData } from 'node:worker_threads';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ELK } from './elk.js';
import { loadSymbols } from './schematic.js';
import { renderNetlist } from './draw-netlist.js';
import { parserLoader } from './parser/modules.js';
import { ENGINE, FAILED, HEADER, LENGTH, READY, STARTED } from './protocol.js';
const { buffer } = workerData;
const state = new Int32Array(buffer, 0, HEADER / 4);
const bytes = new Uint8Array(buffer, HEADER);
function write(text) {
    const encoded = new TextEncoder().encode(text);
    if (encoded.length > bytes.length)
        throw new RangeError('reply exceeds the shared buffer');
    bytes.set(encoded);
    Atomics.store(state, LENGTH, encoded.length);
    return encoded.length;
}
function reply(result) {
    try {
        write(JSON.stringify(result));
    }
    catch {
        write(JSON.stringify({ status: 'failure', message: 'the schematic is too large to return' }));
    }
    Atomics.store(state, READY, 1);
    Atomics.notify(state, READY);
}
/** An ngspice netlist that touches every common symbol, drawn before the worker reports ready. */
const WARM_UP = 'V1 in 0 1\nR1 in out 1k\nC1 out 0 1u\nQ1 out in 0 npn\nM1 out in 0 0 nmos\nX1 in out box';
async function start() {
    const symbols = loadSymbols(readFileSync(new URL('./skin/symbols.svg', import.meta.url), 'utf8'));
    const elk = new ELK();
    const layout = (graph) => elk.layout(graph);
    const loadParser = parserLoader(fileURLToPath(new URL('../vendor/parsers/', import.meta.url)));
    /**
     * Draw one request. The dialect's parser is loaded the first time a fence in that dialect
     * arrives; a module that will not load is a failure, not a dead worker.
     */
    const render = async ({ source, dialect, files, outputBytes }) => {
        try {
            await loadParser(dialect);
        }
        catch {
            // The loader's message would name vendor paths on this machine.
            return { status: 'failure', message: `the ${dialect} parser could not be loaded` };
        }
        const includes = {
            files: Object.fromEntries(files.map((file) => [file.key, 'text' in file ? file.text : { error: file.error }]))
        };
        const result = await renderNetlist(source, symbols, layout, includes, dialect);
        if (result.status === 'failure') {
            // The netlist reader counts columns from 0; the contract counts them from 1.
            return result.column === undefined ? result : { ...result, column: result.column + 1 };
        }
        if (result.status === 'success' && Buffer.byteLength(result.output) > outputBytes) {
            return { status: 'failure', message: `SPICE output exceeds the ${outputBytes}-byte limit` };
        }
        return result;
    };
    // The first layout in a fresh worker costs a few hundred milliseconds of warm-up that must not
    // be charged to an author's budget, so it is spent here, before this worker reports ready.
    const warm = await render({ source: WARM_UP, dialect: 'ngspice', files: [], outputBytes: Infinity });
    if (warm.status !== 'success')
        throw new Error('the warm-up schematic did not draw');
    return render;
}
start().then((render) => {
    parentPort.on('message', (request) => {
        render(request).then(reply, () => {
            // An unexpected error may leave a parser's wasm instance unusable; the host discards this worker.
            reply({ status: 'failure', message: 'the SPICE renderer stopped unexpectedly', discard: true });
        });
    });
    Atomics.store(state, ENGINE, STARTED);
    Atomics.notify(state, ENGINE);
    parentPort.postMessage('started');
}, () => {
    // The error would name vendor paths on this machine; the reason stays plain and path-free.
    write('the SPICE layout engine could not start');
    Atomics.store(state, ENGINE, FAILED);
    Atomics.notify(state, ENGINE);
    parentPort.postMessage('failed');
});
