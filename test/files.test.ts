import { test, after, before } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, symlink, rm, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRuntime, nodeFileReader, prepare, type FileReader } from '../dist/index.js';

const runtime = await createRuntime();
after(() => runtime.dispose());

let temp: string;
let root: string;
before(async () => {
  temp = await realpath(await mkdtemp(join(tmpdir(), 'spice-renderer-files-')));
  root = join(temp, 'content');
  await mkdir(join(root, 'posts', 'data'), { recursive: true });
  await writeFile(join(root, 'posts', 'data', 'a.csv'), 'x,y,z\n0,0,1\n1,2,2\n2,3,4\n');
  await writeFile(join(root, 'posts', 'b.dat'), '0 1\n1 4\n2 7\n');
  await writeFile(join(root, 'shared.csv'), '0,5\n1,6\n');
  await writeFile(join(temp, 'secret.csv'), '0,2\n');
  // SPICE includes: a library that includes a subcircuit file, a broken library, a stage.
  await mkdir(join(root, 'posts', 'models'), { recursive: true });
  await writeFile(join(root, 'posts', 'models', 'bjt.lib'), '* Models\n.model QP PNP(BF=150)\n.include amp.sub\n');
  await writeFile(join(root, 'posts', 'models', 'amp.sub'), '.subckt amp in out vcc\nR1 in out 1k\n.ends\n');
  await writeFile(join(root, 'posts', 'models', 'broken.lib'), '* fine\nQ9 c b\n');
  await writeFile(join(root, 'posts', 'stage.cir'), '* A stage kept in its own file\nR7 c out 4k7\n');
});
after(() => rm(temp, { recursive: true, force: true }));

const reader = (): FileReader => nodeFileReader({ root, document: join(root, 'posts', 'post.md') });
const decode = (read: Awaited<ReturnType<FileReader['read']>>): string =>
  'bytes' in read ? new TextDecoder().decode(read.bytes) : `error: ${read.error}`;

test('the node file reader reads keys relative to the Markdown file, inside the root', async () => {
  assert.equal(decode(await reader().read('data/a.csv', { maxBytes: 1024 })), 'x,y,z\n0,0,1\n1,2,2\n2,3,4\n');
  assert.equal(decode(await reader().read('../shared.csv', { maxBytes: 1024 })), '0,5\n1,6\n');
});

test('the node file reader refuses escapes, symlinks, folders, missing and oversized files, without a path', async () => {
  await symlink(join(temp, 'secret.csv'), join(root, 'posts', 'link.csv'));
  await symlink(temp, join(root, 'posts', 'linked'), 'dir');
  const cases: [string, number, string][] = [
    ['../../secret.csv', 1024, 'error: the file is outside the content root'],
    ['/etc/passwd', 1024, 'error: the file is outside the content root'],
    ['link.csv', 1024, 'error: symbolic links are not followed'],
    ['linked/secret.csv', 1024, 'error: symbolic links are not followed'],
    ['data', 1024, 'error: not a regular file'],
    ['missing.csv', 1024, 'error: file not found'],
    ['data/a.csv', 10, 'error: the file exceeds the 10-byte limit']
  ];
  for (const [key, maxBytes, expected] of cases) {
    const result = decode(await reader().read(key, { maxBytes }));
    assert.equal(result, expected, key);
    assert.ok(!result.includes(temp), key);
  }
});

test('the node file reader takes absolute paths and rejects anything else', () => {
  assert.throws(() => nodeFileReader({ root: 'content', document: join(root, 'post.md') }), TypeError);
  assert.throws(() => nodeFileReader({ root, document: 'post.md' }), TypeError);
  assert.throws(() => nodeFileReader(undefined as never), TypeError);
});


// --- SPICE includes --------------------------------------------------------------------------------

/** A reader over a fixed set of files, recording what it was asked for. */
function memory(files: Record<string, string>, asked: string[] = []): FileReader {
  return {
    async read(key) {
      asked.push(key);
      return Object.hasOwn(files, key) ? { bytes: new TextEncoder().encode(files[key]) } : { error: 'file not found' };
    }
  };
}


test('includes are read level by level, relative to the Markdown file, and drawn', async () => {
  const asked: string[] = [];
  const read = reader();
  const prepared = await prepare('Q1 c b e QP\n.include "models/bjt.lib"\n.inc stage.cir\nX1 b c vcc amp', {
    reader: { read: (key, options) => { asked.push(key); return read.read(key, options); } }
  });
  assert.equal(prepared.failure, undefined);
  assert.deepEqual(asked, ['models/bjt.lib', 'stage.cir', 'models/amp.sub']);
  assert.deepEqual(prepared.files.map((file) => file.key), ['models/amp.sub', 'models/bjt.lib', 'stage.cir']);
  const result = runtime.render(prepared);
  assert.equal(result.status, 'success', JSON.stringify(result));
  if (result.status !== 'success') return;
  // QP is a PNP from the library, R7 comes from the stage file, and amp is drawn as a block with its pins.
  assert.match(result.output, />QP<\/text>/);
  assert.match(result.output, />4k7<\/text>/);
  assert.match(result.output, />amp<\/text>/);
  assert.deepEqual(result.notes, []);
});

test('an error inside an included file is reported at the fence\'s include, naming the file and its line', async () => {
  assert.deepEqual(runtime.render(await prepare('R1 a 0 1k\n.include models/broken.lib', { reader: reader() })), {
    status: 'failure', message: 'In models/broken.lib, line 2: Q9 needs 3 nodes; found 2.', line: 2, column: 10
  });
});

test('a file that cannot be read is reported where it is included, with the reader\'s reason', async () => {
  assert.deepEqual(runtime.render(await prepare('R1 a 0 1k\n.include nowhere.lib', { reader: reader() })), {
    status: 'failure', message: 'nowhere.lib could not be read: file not found', line: 2, column: 10
  });
  assert.deepEqual(runtime.render(await prepare('.include ../../secret.csv', { reader: reader() })), {
    status: 'failure', message: '../../secret.csv could not be read: the file is outside the content root', line: 1, column: 10
  });
  // A file named like an Object.prototype member is only ever a file.
  assert.deepEqual(runtime.render(await prepare('.include constructor', { reader: reader() })), {
    status: 'failure', message: 'constructor could not be read: file not found', line: 1, column: 10
  });
});

test('an LTspice or PSpice library the reader cannot find is noted, and the schematic drawn without it', async () => {
  for (const dialect of ['ltspice', 'pspice']) {
    const result = runtime.render(await prepare('.lib standard.dio\nD1 a 0 D1N4148', { dialect, reader: reader() }));
    assert.equal(result.status, 'success', dialect);
    assert.match(result.status === 'success' ? result.notes[0]! : '', /^Line 1: \.lib standard\.dio is not read: file not found\./);
  }
});

test('includes are followed in the fence\'s dialect: a one-argument .lib reads a file in PSpice, not in ngspice', async () => {
  const asked: string[] = [];
  const files = { 'models.lib': '.model DX D\n' };
  await prepare('.lib models.lib\nD1 a 0 DX', { reader: memory(files, asked) });
  assert.deepEqual(asked, []);
  const prepared = await prepare('.lib models.lib\nD1 a 0 DX', { dialect: 'pspice', reader: memory(files, asked) });
  assert.deepEqual(asked, ['models.lib']);
  assert.equal(runtime.render(prepared).status, 'success');
});

test('a fence with includes but no reader is a failure; one without includes needs no reader', async () => {
  assert.deepEqual(runtime.render(await prepare('.include a.lib\nR1 a 0 1k')), {
    status: 'failure', message: 'this fence includes files, but no file reader was given to read them'
  });
  assert.equal(runtime.render(await prepare('R1 a 0 1k')).status, 'success');
  const throwing: FileReader = { read: async () => { throw new Error('/secret/path'); } };
  assert.deepEqual(runtime.render(await prepare('.include a.lib', { reader: throwing })), {
    status: 'failure', message: 'a.lib could not be read: the file reader failed', line: 1, column: 10
  });
  const odd: FileReader = { read: async () => ({ bytes: 'text' }) as never };
  assert.deepEqual(runtime.render(await prepare('.include a.lib', { reader: odd })), {
    status: 'failure', message: 'a.lib could not be read: the file reader returned no bytes', line: 1, column: 10
  });
});

test('a cycle of includes terminates and is reported at the fence', async () => {
  const result = runtime.render(await prepare('.include a.lib', { reader: memory({ 'a.lib': '.include b.lib\n', 'b.lib': '.include a.lib\n' }) }));
  assert.equal(result.status, 'failure');
  assert.equal(result.status === 'failure' && result.line, 1);
});

test('a binary file is refused as not text', async () => {
  const binary: FileReader = { read: async () => ({ bytes: new Uint8Array([46, 0, 1]) }) };
  assert.deepEqual(runtime.render(await prepare('.include a.lib', { reader: binary })), {
    status: 'failure', message: 'a.lib could not be read: it is not a text file', line: 1, column: 10
  });
});

test('preparation limits default to 32 files, 8 MiB each and 16 MiB together, and can be changed', async () => {
  const many = Array.from({ length: 33 }, (_, i) => `.include f${i}.lib`).join('\n');
  const all = Object.fromEntries(Array.from({ length: 33 }, (_, i) => [`f${i}.lib`, '* empty\n']));
  assert.deepEqual(runtime.render(await prepare(many, { reader: memory(all) })), {
    status: 'failure', message: 'f32.lib could not be read: a fence may include at most 32 files', line: 33, column: 10
  });
  const big = (bytes: number): FileReader => ({ read: async (_key, { maxBytes }) => {
    assert.equal(maxBytes, 8 * 1024 * 1024);
    return { bytes: new Uint8Array(bytes).fill(42) };
  } });
  assert.deepEqual(runtime.render(await prepare('.include a.lib', { reader: big(8 * 1024 * 1024 + 1) })), {
    status: 'failure', message: 'a.lib could not be read: it is larger than 8 MB', line: 1, column: 10
  });
  const three = '.include a.lib\n.include b.lib\n.include c.lib';
  const together = await prepare(three, { reader: big(6 * 1024 * 1024) });
  assert.deepEqual(together.files.find((file) => file.key === 'c.lib'), { key: 'c.lib', error: 'the included files exceed 16 MB together' });
  assert.deepEqual(runtime.render(await prepare('.include a.lib\n.include b.lib', { reader: memory({ 'a.lib': '* a\n', 'b.lib': '* b\n' }), limits: { files: 1 } })), {
    status: 'failure', message: 'b.lib could not be read: a fence may include at most 1 files', line: 2, column: 10
  });
  const sized = await prepare('.include a.lib', { reader: { read: async (_key, { maxBytes }) => ({ error: `max ${maxBytes}` }) }, limits: { fileBytes: 100 } });
  assert.deepEqual(sized.files, [{ key: 'a.lib', error: 'max 100' }]);
  for (const limits of [{ files: 0 }, { totalBytes: -1 }, { fileBytes: Infinity }, { files: Number.NaN }]) {
    await assert.rejects(prepare('R1 a 0 1', { limits }), TypeError, JSON.stringify(limits));
  }
});

test('the identity covers the fence, the dialect and each file\'s key and content, and no absolute path', async () => {
  const base = await prepare('.include a.lib', { reader: memory({ 'a.lib': '.model Q NPN\n' }) });
  assert.match(base.identity, /^[0-9a-f]{64}$/);
  assert.equal((await prepare('.include a.lib', { reader: memory({ 'a.lib': '.model Q NPN\n' }) })).identity, base.identity);
  assert.notEqual((await prepare('.include a.lib', { reader: memory({ 'a.lib': '.model Q PNP\n' }) })).identity, base.identity);
  assert.notEqual((await prepare('.include a.lib ', { reader: memory({ 'a.lib': '.model Q NPN\n' }) })).identity, base.identity);
  assert.notEqual((await prepare('.include a.lib', { reader: memory({}) })).identity, base.identity);
  assert.notEqual((await prepare('.include a.lib', { dialect: 'xyce', reader: memory({ 'a.lib': '.model Q NPN\n' }) })).identity, base.identity);
  // The dialect is named in any case, and the identity follows the dialect, not its spelling.
  assert.equal((await prepare('R1 a 0 1')).identity, (await prepare('R1 a 0 1', { dialect: 'NGSPICE' })).identity);
  const real = await prepare('.include stage.cir', { reader: reader() });
  const elsewhere = await prepare('.include stage.cir', { reader: memory({ 'stage.cir': '* A stage kept in its own file\nR7 c out 4k7\n' }) });
  assert.equal(real.identity, elsewhere.identity);
});
