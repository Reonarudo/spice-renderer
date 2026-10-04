import type { DialectId } from '../catalogue/types.js';
/**
 * A loader for the modules in `directory` — `dist/../vendor/parsers` in the package.
 * The returned function resolves once the dialect parses synchronously through the registry, and
 * rejects — never throws — with one sentence naming the module and why. Both outcomes are kept,
 * so every fence after the first costs a lookup, and a module that would not load is not asked
 * again: it will not appear while the process runs.
 */
export declare function parserLoader(directory: string): (dialect: DialectId) => Promise<void>;
