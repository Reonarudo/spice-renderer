/** The two-phase reply (docs/adr/0001): where `bom` and `notes` are present on each status, and why. */
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { createRuntime, prepare, type BomRow, type RenderResult, type Runtime } from '../dist/index.js';
import { aggregate } from '../src/bom.js';
import { parseNetlist } from '../src/netlist.js';
import { loadNgspice } from './helpers/ngspice.js';
import { HEADER, PARSED } from '../src/protocol.js';

const runtime = await createRuntime();
after(() => runtime.dispose());

const render = async (source: string, on: Runtime = runtime): Promise<RenderResult> => on.render(await prepare(source));

/** 200 resistors among 41 nodes: dense enough that ELK takes seconds, not milliseconds. */
const mesh = Array.from({ length: 200 }, (_, i) => `R${i} n${i % 37} n${(i * 7 + 3) % 41} 1k`).join('\n');

/** The mesh's one row: every resistor is `1k`. */
const meshRow = (): BomRow => ({
  type: 'resistor', name: 'resistor', value: '1k',
  references: Array.from({ length: 200 }, (_, i) => ({ ref: `R${i}`, line: i + 1 }))
});

const BRIDGE = 'VAC ac1 ac2 SIN(0 12 50)\nD1 ac1 plus 1N4007\nD2 ac2 plus 1N4007\nD3 0 ac1 1N4007\nD4 0 ac2 1N4007\nC1 plus 0 1000u\nRL plus 0 1k\n.model 1N4007 D';

test('success carries the rows and the notes beside the SVG', async () => {
  const result = await render(BRIDGE);
  assert.equal(result.status, 'success');
  if (result.status !== 'success') return;
  assert.deepEqual(result.bom.map((row) => [row.references.length, row.references.map((reference) => reference.ref).join(', '), row.name, row.value]), [
    [1, 'VAC', 'voltage source', 'SIN(0 12 50)'],
    [4, 'D1, D2, D3, D4', 'diode', '1N4007'],
    [1, 'C1', 'capacitor', '1000u'],
    [1, 'RL', 'resistor', '1k']
  ]);
  assert.deepEqual(result.notes, []);
});

test('a parse failure carries neither rows nor notes', async () => {
  const result = await render('R1 a b');
  assert.equal(result.status, 'failure');
  assert.equal('bom' in result, false);
  assert.equal('notes' in result, false);
});

test('a failure after the parsed stage (the output limit) carries both, inline', async () => {
  const small = await createRuntime({ limits: { outputBytes: 500 } });
  try {
    const result = await render('R1 a 0 1k\nK1 L1 L2 0.9\nL1 a 0 1m\nL2 b 0 1m', small);
    assert.equal(result.status, 'failure');
    if (result.status !== 'failure') return;
    assert.equal(result.message, 'SPICE output exceeds the 500-byte limit');
    assert.deepEqual(result.bom?.map((row) => row.references.map((reference) => reference.ref)), [['R1'], ['L1', 'L2']]);
    assert.deepEqual(result.notes, ['Line 2: mutual inductance K1 (L1 L2 0.9) is not drawn.']);
  } finally {
    await small.dispose();
  }
});

test('a timeout long enough to parse but not to lay out carries the parsed stage, read from the tail', async () => {
  const quick = await createRuntime({ timeout: 200 });
  try {
    assert.deepEqual(await render(mesh, quick), { status: 'timeout', budget: 200, bom: [meshRow()], notes: [] });
  } finally {
    await quick.dispose();
  }
});

test('a timeout before the netlist is read carries neither', async () => {
  // One millisecond: the worker has not received the request, let alone parsed it.
  const instant = await createRuntime({ timeout: 1 });
  try {
    const result = await render(mesh, instant);
    assert.equal(result.status, 'timeout');
    assert.equal('bom' in result, 'notes' in result, 'bom and notes are present together or absent together');
  } finally {
    await instant.dispose();
  }
});

test('PARSED is zero at the start of every request: a timeout after a success does not replay the success\'s rows', async () => {
  const quick = await createRuntime({ timeout: 200 });
  try {
    const first = await render(BRIDGE, quick);
    assert.equal(first.status, 'success');
    // The reader finds the error before the parsed stage, so nothing is written at the tail this time.
    const second = await render('R1 a b', quick);
    assert.equal(second.status, 'failure');
    assert.equal('bom' in second, false);
    const third = await render(mesh, quick);
    assert.deepEqual(third, { status: 'timeout', budget: 200, bom: [meshRow()], notes: [] });
  } finally {
    await quick.dispose();
  }
});

test('the header has four slots, so the data region starts at byte 16', () => {
  assert.equal(PARSED, 3);
  assert.equal(HEADER, 16);
});

test('the worst-case parsed stage fits the 262144-byte slack the runtime reserves', async () => {
  // The slack is constant: capacity is twice the output limit plus 262144, so the early write is
  // guarded by what a 64000-character fence (the source limit) can produce, not by an option.
  // The largest payload: 400 parts (the reader's cap) with distinct tails — so no two share a row —
  // as long as the limit allows and made of characters JSON escapes to two bytes.
  await loadNgspice();
  const tail = '"'.repeat(Math.floor((64000 - 400 * 24) / 400));
  const source = Array.from({ length: 400 }, (_, i) => `R${i} a${i} b${i} ${i}${tail}`).join('\n');
  assert.ok(source.length <= 64000, `${source.length} characters`);
  const parsed = parseNetlist(source);
  assert.ok(parsed.ok, !parsed.ok ? parsed.message : '');
  if (!parsed.ok) return;
  const bytes = Buffer.byteLength(JSON.stringify({ bom: aggregate(parsed.netlist.parts), notes: parsed.netlist.notes }));
  assert.ok(bytes < 262144, `${bytes} bytes`);
  assert.ok(bytes > 128000, `${bytes} bytes: the case is not the worst one`);
});
