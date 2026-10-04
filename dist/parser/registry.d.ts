/**
 * The loaded parsers, one per dialect (ADR 0008): a module is awaited once, then parses
 * synchronously for the rest of the process. `parseNetlist` and `includeReferences` stay
 * synchronous by reading from here, so whoever calls them first — the worker for a dialect's
 * first fence, a test's `before` hook — must have awaited `loadParser` for that dialect.
 *
 * Locating a module is the caller's job: `vendor/parsers/<dialect>.cjs` is only a stable relative
 * path from the directory that sits beside `vendor/` (`dist/` in the package, `test/`
 * here), so the caller `require`s it and hands over the factory.
 */
import type { DialectId } from '../catalogue/types.js';
import { type ParserOutput } from './contract.js';
/** The surface of an Emscripten 6 module built by `scripts/grammars.sh`: the factory returns a promise. */
export interface ParserModule {
    _netlist_parse(pointer: number, length: number): number;
    _malloc(bytes: number): number;
    _free(pointer: number): void;
    lengthBytesUTF8(text: string): number;
    stringToUTF8(text: string, pointer: number, bytes: number): void;
    UTF8ToString(pointer: number): string;
}
export type ParserFactory = () => Promise<ParserModule>;
/**
 * Await a dialect's module once and keep it. The module's `factory` is what `require`ing
 * `vendor/parsers/<dialect>.cjs` returns.
 */
export declare function loadParser(dialect: DialectId, factory: ParserFactory): Promise<void>;
/** Parse one file's text with the dialect's module. Throws when the dialect was never loaded. */
export declare function parse(dialect: DialectId, text: string): ParserOutput;
