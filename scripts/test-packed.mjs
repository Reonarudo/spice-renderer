// Install the packed tarball into a throwaway project, the way a git dependency is installed, and
// render one fence through it: proves `files`, `exports` and the worker, symbol and parser self-location.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const work = mkdtempSync(join(tmpdir(), 'spice-renderer-packed-'));
try {
  const [{ filename }] = JSON.parse(execFileSync('npm', ['pack', '--json', '--pack-destination', work], { cwd: root, encoding: 'utf8' }));
  writeFileSync(join(work, 'package.json'), JSON.stringify({ name: 'consumer', private: true, type: 'module' }));
  // npm reports a scoped tarball by its package name; the file on disk has the scope flattened.
  const tarball = join(work, filename.replace(/^@/, '').replace('/', '-'));
  execFileSync('npm', ['install', '--no-audit', '--no-fund', tarball], { cwd: work, stdio: 'inherit' });
  writeFileSync(join(work, 'models.lib'), '.model QP PNP\n');
  writeFileSync(join(work, 'smoke.js'), `
    import { createRuntime, nodeFileReader, prepare } from '@reonarudo/spice-renderer';
    const runtime = await createRuntime();
    const reader = nodeFileReader({ root: ${JSON.stringify(work)}, document: ${JSON.stringify(join(work, 'post.md'))} });
    const prepared = await prepare('.include models.lib\\nQ1 c b e QP\\nR1 c 0 1k', { reader, dialect: 'LTspice' });
    const result = runtime.render(prepared);
    await runtime.dispose();
    if (result.status !== 'success' || !result.output.startsWith('<svg class="spice" ') || !result.output.includes('>QP</text>')) {
      console.error(JSON.stringify(result));
      process.exit(1);
    }
    console.log('packed install renders: ok');
  `);
  // Run from elsewhere, so nothing resolves relative to the working directory.
  execFileSync(process.execPath, [join(work, 'smoke.js')], { cwd: tmpdir(), stdio: 'inherit' });
} finally {
  rmSync(work, { recursive: true, force: true });
}
