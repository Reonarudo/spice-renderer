/**
 * The dialects a fence may be read in. The consumer chooses one — a fence attribute, else its own
 * default, else ngspice — and hands it to `prepare`; the library only checks the name.
 */
import type { DialectId } from './catalogue/types.js';
import { PUBLIC_DIALECTS } from './catalogue/dialects.js';

/** A dialect an author may name. `spectre-spice` is internal: only `simulator lang=` enters it. */
export type PublicDialect = Exclude<DialectId, 'spectre-spice'>;

export const DEFAULT_DIALECT: PublicDialect = 'ngspice';

/** The accepted spellings, for a consumer's validation and diagnostics. */
export const DIALECT_NAMES: readonly PublicDialect[] = PUBLIC_DIALECTS as readonly PublicDialect[];

/** The dialect a value names, matched case-insensitively with no aliases; `undefined` for anything else. */
export function publicDialect(value: unknown): PublicDialect | undefined {
  if (typeof value !== 'string') return undefined;
  const name = value.trim().toLowerCase();
  return DIALECT_NAMES.find((dialect) => dialect === name);
}
