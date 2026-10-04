/**
 * Where the worker finds a dialect's generated parser: `<directory>/<dialect>.cjs`, the modules
 * `scripts/grammars.sh` vendors (ADR 0008). Each is `require`d and handed to the registry the
 * first time a fence in its dialect arrives, so a dialect that is never used is never loaded. A
 * Spectre fence needs two: its netlist may switch to SPICE mode (`src/parser/regions.ts`).
 */
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { DIALECTS } from '../catalogue/dialects.js';
import { loadParser } from './registry.js';
import { modulesFor } from './regions.js';
/**
 * A loader for the modules in `directory` — `dist/../vendor/parsers` in the package.
 * The returned function resolves once the dialect parses synchronously through the registry, and
 * rejects — never throws — with one sentence naming the module and why. Both outcomes are kept,
 * so every fence after the first costs a lookup, and a module that would not load is not asked
 * again: it will not appear while the process runs.
 */
export function parserLoader(directory) {
    const require = createRequire(join(directory, 'index.cjs'));
    const outcomes = new Map();
    const one = (module) => {
        let outcome = outcomes.get(module);
        if (!outcome) {
            outcome = load(module).catch((error) => {
                throw new Error(`The ${module} parser could not be loaded: ${reason(error)}`);
            });
            outcomes.set(module, outcome);
        }
        return outcome;
    };
    return async (dialect) => {
        for (const module of modulesFor(dialect))
            await one(module);
    };
    async function load(dialect) {
        // The dialect names a file: only a known name may be turned into a path.
        if (!Object.hasOwn(DIALECTS, dialect))
            throw new Error('not a dialect');
        await loadParser(dialect, require(join(directory, `${dialect}.cjs`)));
    }
}
/** The first line of the cause: Node's "Cannot find module" carries a require stack nobody needs. */
function reason(error) {
    const message = error instanceof Error ? error.message : String(error);
    return message.split('\n', 1)[0].slice(0, 200);
}
