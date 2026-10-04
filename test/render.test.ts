import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { DOMParser, type Element } from '@xmldom/xmldom';
import { createRuntime, prepare, DIALECT_NAMES, type RenderResult, type Runtime } from '../dist/index.js';

const runtime = await createRuntime();
after(() => runtime.dispose());

const render = async (source: string, dialect?: string, on: Runtime = runtime): Promise<RenderResult> =>
  on.render(await prepare(source, dialect === undefined ? {} : { dialect }));

const success = (result: RenderResult): string => {
  assert.equal(result.status, 'success', JSON.stringify(result));
  return result.status === 'success' ? result.output : '';
};

/** 200 resistors among 41 nodes: dense enough that ELK takes seconds, not milliseconds. */
const mesh = Array.from({ length: 200 }, (_, i) => `R${i} n${i % 37} n${(i * 7 + 3) % 41} 1k`).join('\n');

/** One fence per dialect, each drawn as the extension's demo draws it. */
const FENCES: Record<string, string> = {
  ngspice: '* RC low-pass driving an emitter follower\nV1 in 0 AC 1\nR1 in mid 10k\nC1 mid 0 100n\nQ1 vcc mid out 2N3904\nR2 out 0 1k\nVCC vcc 0 5\n.model 2N3904 NPN\n.tran 1u 1m',
  ltspice: 'V1 in 0 SIN(0 1 1k)\nR1 in n1 10k\nC1 n1 0 100n\nA1 n1 0 0 0 0 0 out 0 SCHMITT Vt=0.5 Vh=0.1\nRL out 0 10k',
  pspice: 'U1 NAND(2) $G_DPWR $G_DGND set qb q D_00 IO_STD\nU2 NAND(2) $G_DPWR $G_DGND rst q qb D_00 IO_STD',
  hspice: 'V1 in 0 1.8\nR1 in out 10k\nC1 out 0 1p\nM1 out in 0 0 nch W=1u L=180n\n.model nch NMOS LEVEL=54',
  xyce: 'V1 in 0 1\nR1 in out 1k\nC1 out 0 1u\nD1 out 0 DMOD\n.model DMOD D',
  spectre: 'global 0 vdd\nV1 (vdd 0) vsource dc=1.8\nM1 (out in vdd vdd) pch w=2u l=180n\nM2 (out in 0 0) nch w=1u l=180n\nmodel nch bsim4 type=n\nmodel pch bsim4 type=p'
};

/**
 * What a schematic may contain: the elements and attributes the drawing builds, and no value that
 * names a script, a data URL or a network address. spice is safe by construction; this proves it.
 */
const ELEMENTS = new Set(['svg', 'g', 'path', 'circle', 'rect', 'text']);
const ATTRIBUTES = new Set([
  'class', 'viewBox', 'xmlns', 'transform', 'd', 'cx', 'cy', 'r', 'x', 'y', 'width', 'height',
  'fill', 'stroke', 'stroke-width', 'stroke-linejoin', 'stroke-linecap',
  'font-family', 'font-size', 'font-weight', 'text-anchor'
]);
function assertSafe(svg: string): void {
  assert.doesNotMatch(svg, /<!--|<!DOCTYPE|<\?xml|<!ENTITY/i);
  const document = new DOMParser({ onError: (level, message) => { throw new Error(`${level}: ${message}`); } })
    .parseFromString(svg, 'image/svg+xml');
  const root = document.documentElement!;
  assert.equal(root.getAttribute('class'), 'spice');
  assert.equal(root.hasAttribute('width') || root.hasAttribute('height'), false);
  const visit = (element: Element): void => {
    assert.ok(ELEMENTS.has(element.tagName), `element <${element.tagName}>`);
    for (const attribute of Array.from(element.attributes)) {
      assert.ok(ATTRIBUTES.has(attribute.name), `attribute ${attribute.name} on <${element.tagName}>`);
      if (attribute.name === 'xmlns') {
        assert.equal(attribute.value, 'http://www.w3.org/2000/svg');
        continue;
      }
      assert.doesNotMatch(attribute.value, /javascript:|data:|:\/\/|url\(/i, `${attribute.name}="${attribute.value}"`);
    }
    for (const child of Array.from(element.childNodes)) if (child.nodeType === 1) visit(child as Element);
  };
  visit(root);
}

test('a netlist renders to one inline-ready SVG that paints itself, with the reader\'s notes', async () => {
  const result = await render('V1 in 0 5\nR1 in out 1k\nQ1 out in 0 BC547');
  const svg = success(result);
  assert.match(svg, /^<svg class="spice" viewBox="[-\d.]+ [-\d.]+ [\d.]+ [\d.]+" fill="none" stroke="#000" /);
  assert.match(svg, /<\/svg>$/);
  assert.match(svg, />BC547<\/text>/);
  assert.match(svg, /<path d="[^"]+" class="wire" stroke-width="1" stroke-linecap="round"\/>/);
  assert.deepEqual(result.status === 'success' && result.notes, ['Line 3: model BC547 of Q1 is not defined here; drawn as NPN.']);
  assertSafe(svg);
});

test('every public dialect renders, named in any case', async () => {
  assert.deepEqual(Object.keys(FENCES), [...DIALECT_NAMES]);
  for (const [dialect, source] of Object.entries(FENCES)) {
    const result = await render(source, dialect.toUpperCase());
    assertSafe(success(result));
  }
  // A Spectre fence is not SPICE: read as ngspice it fails.
  assert.equal((await render(FENCES.spectre!)).status, 'failure');
});

test('a dialect that is not one is a failure naming the choices, and a non-string one a programmer error', async () => {
  assert.deepEqual(await render('R1 a 0 1k', 'spectre-spice'), {
    status: 'failure',
    message: '"spectre-spice" is not a SPICE dialect; use one of ngspice, ltspice, pspice, hspice, xyce, spectre'
  });
  await assert.rejects(prepare('R1 a 0 1k', { dialect: 7 as never }), TypeError);
});

test('a netlist error comes back with its 1-based line and column', async () => {
  assert.deepEqual(await render('R1 a b 1k\nD1 a'), { status: 'failure', message: 'D1 needs 2 nodes; found 1.', line: 2, column: 6 });
  const title = await render('RC filter\nR1 a 0 1k');
  assert.equal(title.status, 'failure');
  assert.equal(title.status === 'failure' && title.line, 1);
});

test('fence text cannot inject markup, handlers or links: it is only ever escaped text', async () => {
  const hostile = [
    'R1 a b <script>alert(1)</script>',
    'X1 a b "><foreignObject onload=alert(1)>',
    'Q1 c b e javascript:alert(1)',
    'D1 a 0 data:text/html,x',
    'V1 a 0 https://example.com/x.svg',
    'C1 a 0 url(#x)',
    '.model javascript:alert(1) NPN',
    '.subckt evil <img/src=x>',
    '.ends'
  ].join('\n');
  const result = await render(hostile);
  if (result.status === 'success') {
    assertSafe(result.output);
    assert.doesNotMatch(result.output, /<(script|foreignObject|img)\b/);
  } else {
    assert.equal(result.status, 'failure');
  }
  // Each line alone, so that one that draws is checked even if another fails the whole fence.
  for (const line of hostile.split('\n')) {
    const alone = await render(line);
    if (alone.status === 'success') {
      assertSafe(alone.output);
      assert.doesNotMatch(alone.output, /<(script|foreignObject|img)\b/);
    }
  }
});

test('two schematics on one page share nothing to collide on: no id, reference or style', async () => {
  for (const svg of [success(await render('R1 a 0 1k')), success(await render(FENCES.ngspice!))]) {
    assert.doesNotMatch(svg, /\bid=|href=|url\(|<style|style=/);
  }
});

test('the same input renders byte-identically, in this runtime and another', async () => {
  const prepared = await prepare(FENCES.ngspice!);
  const first = success(runtime.render(prepared));
  assert.equal(success(runtime.render(prepared)), first);
  const other = await createRuntime();
  try {
    assert.equal(success(other.render(await prepare(FENCES.ngspice!))), first);
  } finally {
    await other.dispose();
  }
});

test('a source one character over sourceChars fails naming the limit; one at the limit renders', async () => {
  const sized = (length: number): string => {
    const body = 'R1 a 0 1k\n* ';
    return body + 'x'.repeat(length - body.length);
  };
  assert.equal(sized(64000).length, 64000);
  success(await render(sized(64000)));
  assert.deepEqual(await render(sized(64001)), { status: 'failure', message: 'SPICE source exceeds the 64000-character limit' });
  const small = await createRuntime({ limits: { sourceChars: 20 } });
  try {
    assert.deepEqual(await render(sized(21), undefined, small), { status: 'failure', message: 'SPICE source exceeds the 20-character limit' });
    success(await render(sized(20), undefined, small));
  } finally {
    await small.dispose();
  }
});

test('an output over outputBytes fails naming the limit', async () => {
  const small = await createRuntime({ limits: { outputBytes: 500 } });
  try {
    assert.deepEqual(await render(FENCES.ngspice!, undefined, small), { status: 'failure', message: 'SPICE output exceeds the 500-byte limit' });
  } finally {
    await small.dispose();
  }
});

test('a runaway layout times out within its budget, and the next render on the runtime succeeds', async () => {
  const quick = await createRuntime({ timeout: 200 });
  try {
    const prepared = await prepare(mesh);
    let started = Date.now();
    assert.deepEqual(quick.render(prepared), { status: 'timeout', budget: 200 });
    assert.ok(Date.now() - started < 1200, `timed out after ${Date.now() - started} ms`);
    // The replacement worker loads ELK and draws its warm-up, which takes longer than 200 ms;
    // none of it is charged to this render's budget.
    started = Date.now();
    success(await render('R1 a 0 1k', undefined, quick));
    assert.ok(Date.now() - started < 10000);
  } finally {
    await quick.dispose();
  }
});

test('an engine that cannot start in time is unavailable, with a plain reason', async () => {
  const hasty = await createRuntime({ startupTimeout: 1 });
  try {
    const result = hasty.render(await prepare('R1 a 0 1k'));
    assert.deepEqual(result, { status: 'unavailable', reason: 'the SPICE layout worker did not start within 1 ms' });
  } finally {
    await hasty.dispose();
  }
});

test('messages and notes are plain text: no markup from the reader, no absolute path', async () => {
  const results = [
    await render('R1 a b 1k\nD1 a <b>'),
    await render('.include /etc/passwd'),
    runtime.render(await prepare('.lib standard.dio\nD1 a 0 1N4148', { dialect: 'ltspice', reader: { read: async () => ({ error: 'file not found' }) } })),
    await render('Q1 c b e <QX>')
  ];
  for (const result of results) {
    const texts = result.status === 'failure' ? [result.message] : result.status === 'success' ? result.notes : [];
    for (const text of texts) {
      assert.doesNotMatch(text, new RegExp(process.cwd().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      assert.doesNotMatch(text, /\/Users\/|\/home\/|node_modules|vendor\/parsers/);
    }
  }
  assert.deepEqual(results[1], {
    status: 'failure', message: 'Only paths relative to the Markdown document are read. (/etc/passwd)', line: 1, column: 10
  });
  assert.deepEqual(results[2]!.status === 'success' && results[2]!.notes[0],
    'Line 1: .lib standard.dio is not read: file not found. LTspice reads it from its own library folder.');
});

test('invalid runtime options reject createRuntime', async () => {
  for (const options of [
    { timeout: 0 }, { timeout: -1 }, { timeout: Number.NaN }, { timeout: Infinity },
    { startupTimeout: 0 }, { limits: { sourceChars: Infinity } }, { limits: { outputBytes: -5 } },
    { timeout: '3000' }, { limits: null }, null
  ]) {
    await assert.rejects(createRuntime(options as never), TypeError, JSON.stringify(options));
  }
});

test('render throws only for programmer errors: input not from prepare, or after dispose', async () => {
  for (const input of [undefined, 'R1 a 0 1k', { source: 'R1 a 0 1k' },
    { source: 'R1', dialect: 'ngspice', files: [], identity: 'x' },
    { source: 'R1', dialect: 'bogus', files: [], identity: '0'.repeat(64) }]) {
    assert.throws(() => runtime.render(input as never), TypeError, JSON.stringify(input));
  }
  const brief = await createRuntime();
  await brief.dispose();
  await brief.dispose();
  await assert.rejects(async () => brief.render(await prepare('R1 a 0 1k')), /after dispose/);
});
