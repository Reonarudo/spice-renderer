import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { aggregate, type BomRow } from '../src/bom.js';
import { parseNetlist, type IncludeSet, type Part } from '../src/netlist.js';
import { loadNgspice } from './helpers/ngspice.js';
import { loadSpectre } from './helpers/spectre.js';

before(async () => { await loadNgspice(); await loadSpectre(); });

function parts(source: string, files?: IncludeSet['files'], dialect?: Parameters<typeof parseNetlist>[2]): Part[] {
  const result = parseNetlist(source, files && { files }, dialect);
  if (!result.ok) assert.fail(`unexpected error: ${result.message} at ${result.line}:${result.column}`);
  return result.netlist.parts;
}

/** A row as the spec's worked examples write it: `[qty, references, type, value, file?]`. */
const flat = (row: BomRow): (string | number)[] => {
  const files = [...new Set(row.references.flatMap((reference) => reference.file ?? []))];
  const value = [row.title, row.value].filter((part) => part).join(' ');
  return [row.references.length, row.references.map((reference) => reference.ref).join(', '), row.name, value, ...(files.length ? [files.join(', ')] : [])];
};

/** Section 3.5 of the BOM view spec, verbatim. */
const BRIDGE = 'VAC ac1 ac2 SIN(0 12 50)\nD1 ac1 plus 1N4007\nD2 ac2 plus 1N4007\nD3 0 ac1 1N4007\nD4 0 ac2 1N4007\nC1 plus 0 1000u\nRL plus 0 1k\n.model 1N4007 D';
const AMPLIFIER = 'VCC vcc 0 12\nVIN in 0 SIN(0 10m 1k)\nC1 in b 10u\nR1 vcc b 47k\nR2 b 0 10k\nQ1 c b e BC547\nRC vcc c 4.7k\nRE e 0 1k\nCE e 0 100u\nC2 c out 10u\nRL out 0 100k\n.model BC547 NPN';
const OPAMP = 'V1 in 0 SIN(0 1 1k)\nX1 in mid vcc vee mid opamp\nR1 mid inv 10k\nR2 inv out 47k\nX2 mid inv vcc vee out opamp\nRL out 0 10k\nVCC vcc 0 15\nVEE 0 vee 15\n.subckt opamp inp inn vp vn out\nE1 out 0 inp inn 100k\n.ends';
const INCLUDES = '.include "included/stage.cir"\nX1 inp inn vcc vee out LM358\nR1 out fb 1k m=2\nR2 fb 0 1k';
const STAGE = { 'included/stage.cir': 'R7 c out 4k7\n' };

test('bridge rectifier: four diodes aggregate into one row', () => {
  assert.deepEqual(aggregate(parts(BRIDGE)).map(flat), [
    [1, 'VAC', 'voltage source', 'SIN(0 12 50)'],
    [4, 'D1, D2, D3, D4', 'diode', '1N4007'],
    [1, 'C1', 'capacitor', '1000u'],
    [1, 'RL', 'resistor', '1k']
  ]);
});

test('common-emitter amplifier: C2 joins C1\'s row at C1\'s position', () => {
  assert.deepEqual(aggregate(parts(AMPLIFIER)).map(flat), [
    [1, 'VCC', 'voltage source', '12'],
    [1, 'VIN', 'voltage source', 'SIN(0 10m 1k)'],
    [2, 'C1, C2', 'capacitor', '10u'],
    [1, 'R1', 'resistor', '47k'],
    [1, 'R2', 'resistor', '10k'],
    [1, 'Q1', 'bipolar transistor', 'BC547'],
    [1, 'RC', 'resistor', '4.7k'],
    [1, 'RE', 'resistor', '1k'],
    [1, 'CE', 'capacitor', '100u'],
    [1, 'RL', 'resistor', '100k']
  ]);
});

test('opamp buffer: the subcircuit title is the value, the supplies merge, the body\'s E1 is no part', () => {
  const rows = aggregate(parts(OPAMP));
  assert.deepEqual(rows.map(flat), [
    [1, 'V1', 'voltage source', 'SIN(0 1 1k)'],
    [2, 'X1, X2', 'subcircuit', 'opamp'],
    [2, 'R1, RL', 'resistor', '10k'],
    [1, 'R2', 'resistor', '47k'],
    [2, 'VCC, VEE', 'voltage source', '15']
  ]);
  assert.deepEqual(rows[1], {
    type: 'subcircuit', name: 'subcircuit', title: 'opamp', value: '',
    references: [{ ref: 'X1', line: 2 }, { ref: 'X2', line: 5 }]
  });
  assert.equal(rows.some((row) => row.references.some((reference) => reference.ref === 'E1')), false);
});

test('includes and multiplicity: the included row comes first with its file, m=2 keeps rows apart', () => {
  const rows = aggregate(parts(INCLUDES, STAGE));
  assert.deepEqual(rows.map(flat), [
    [1, 'R7', 'resistor', '4k7', 'included/stage.cir'],
    [1, 'X1', 'subcircuit', 'LM358'],
    [1, 'R1', 'resistor', '1k m=2'],
    [1, 'R2', 'resistor', '1k']
  ]);
  assert.deepEqual(rows[0]!.references, [{ ref: 'R7', line: 1, file: 'included/stage.cir' }]);
  assert.deepEqual(rows[2]!.references, [{ ref: 'R1', line: 3 }]);
});

test('the key folds case and whitespace, and nothing else', () => {
  const refs = (source: string) => aggregate(parts(source)).map((row) => row.references.map((reference) => reference.ref));
  assert.deepEqual(refs('R1 a b 10K\nR2 b c 10k'), [['R1', 'R2']]);
  assert.deepEqual(refs('M1 d g s b nch W=1u  L=180n\nM2 d g s b NCH W=1u L=180n\n.model nch NMOS'), [['M1', 'M2']]);
  assert.deepEqual(refs('R1 a b 1e4\nR2 b c 10k'), [['R1'], ['R2']]);
  assert.deepEqual(refs('R1 a b 10k tc1=0.01\nR2 b c 10k'), [['R1'], ['R2']]);
  assert.deepEqual(refs('R1 a b 1k m=2\nR2 b c 1k'), [['R1'], ['R2']]);
});

test('the value is the first reference\'s tail, unfolded', () => {
  const [row] = aggregate(parts('R1 a b 10K\nR2 b c 10k'));
  assert.equal(row!.value, '10K');
});

test('two subcircuit instances with different titles are two rows; the same tail does not merge them', () => {
  const rows = aggregate(parts('X1 a b one\nX2 a b two\n.subckt one p q\n.ends\n.subckt two p q\n.ends'));
  assert.deepEqual(rows.map((row) => [row.title, row.references.map((reference) => reference.ref)]), [['one', ['X1']], ['two', ['X2']]]);
});

test('an included part joins a fence row of the same key, and only its reference carries the file', () => {
  const rows = aggregate(parts('R1 a b 1k\n.include "more.cir"', { 'more.cir': 'R9 c d 1k\n' }));
  assert.deepEqual(rows, [{
    type: 'resistor', name: 'resistor', value: '1k',
    references: [{ ref: 'R1', line: 1 }, { ref: 'R9', line: 1, file: 'more.cir' }]
  }]);
});

test('rows are in first-reference order; a later part joining an earlier row does not move it', () => {
  const rows = aggregate(parts('R1 a b 1k\nC1 b 0 1u\nR2 c d 1k'));
  assert.deepEqual(rows.map((row) => row.references.map((reference) => reference.ref)), [['R1', 'R2'], ['C1']]);
});

test('mutual inductance is a note, not a row; .subckt bodies are not rows', () => {
  const rows = aggregate(parts('L1 a 0 1m\nL2 b 0 1m\nK1 L1 L2 0.9\n.subckt hidden p q\nR1 p q 1k\n.ends'));
  assert.deepEqual(rows.map((row) => row.references.map((reference) => reference.ref)), [['L1', 'L2']]);
});

test('an empty tail gives an empty value and no title', () => {
  const [row] = aggregate(parts('d1 (out 0) diode', undefined, 'spectre'));
  assert.equal(row!.value, '');
  assert.equal('title' in row!, false);
});

test('the type is the catalogue id, so a Spectre resistor and an ngspice R share a type and name', () => {
  const spectre = aggregate(parts('R1 (a b) resistor r=10k', undefined, 'spectre'));
  const ngspice = aggregate(parts('R1 a b 10k'));
  assert.equal(spectre[0]!.type, ngspice[0]!.type);
  assert.equal(spectre[0]!.name, 'resistor');
});

test('no parts: no rows', () => {
  assert.deepEqual(aggregate([]), []);
});
