import { PUBLIC_DIALECTS } from './catalogue/dialects.js';
export const DEFAULT_DIALECT = 'ngspice';
/** The accepted spellings, for a consumer's validation and diagnostics. */
export const DIALECT_NAMES = PUBLIC_DIALECTS;
/** The dialect a value names, matched case-insensitively with no aliases; `undefined` for anything else. */
export function publicDialect(value) {
    if (typeof value !== 'string')
        return undefined;
    const name = value.trim().toLowerCase();
    return DIALECT_NAMES.find((dialect) => dialect === name);
}
