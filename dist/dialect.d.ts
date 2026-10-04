/**
 * The dialects a fence may be read in. The consumer chooses one — a fence attribute, else its own
 * default, else ngspice — and hands it to `prepare`; the library only checks the name.
 */
import type { DialectId } from './catalogue/types.js';
/** A dialect an author may name. `spectre-spice` is internal: only `simulator lang=` enters it. */
export type PublicDialect = Exclude<DialectId, 'spectre-spice'>;
export declare const DEFAULT_DIALECT: PublicDialect;
/** The accepted spellings, for a consumer's validation and diagnostics. */
export declare const DIALECT_NAMES: readonly PublicDialect[];
/** The dialect a value names, matched case-insensitively with no aliases; `undefined` for anything else. */
export declare function publicDialect(value: unknown): PublicDialect | undefined;
