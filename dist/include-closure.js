/**
 * Work out which files a fence needs, from whatever is already cached: every file it includes,
 * the files those include, and so on. Kept free of I/O: `prepare` reads what this asks for.
 */
import { includeReferences, MAX_INCLUDE_DEPTH } from './netlist.js';
/** At most this many files are included by one fence, all levels counted. */
export const MAX_FILES = 32;
/** At most this many bytes are included by one fence, all files counted. */
export const MAX_TOTAL_BYTES = 16 * 1024 * 1024;
/** A byte count as an author reads it: whole mebibytes as `16 MB`, anything else in bytes. */
export function size(bytes) {
    return bytes % (1024 * 1024) === 0 ? `${bytes / 1024 / 1024} MB` : `${bytes} bytes`;
}
/**
 * Follow the fence's includes through the cache. Ready when every file reached is cached; else
 * lists the keys to load, all of them at once, so that each level costs one round of reads.
 *
 * A file over the limits is given an error rather than dropped, so that the netlist reader
 * reports it where it is included — and only if it is really included.
 *
 * Every file is read in `dialect`, the including fence's: which directives include, and whether
 * `.lib file` alone does, differ by dialect. Its parser must already be loaded.
 */
export function closure(source, lookup, dialect = 'ngspice', limits = { files: MAX_FILES, totalBytes: MAX_TOTAL_BYTES }) {
    const files = {};
    const identity = [];
    const missing = [];
    let frontier = includeReferences(source, '', dialect);
    let total = 0;
    let count = 0;
    for (let depth = 0; frontier.length > 0 && depth <= MAX_INCLUDE_DEPTH; depth++) {
        const next = [];
        for (const key of frontier) {
            if (Object.hasOwn(files, key) || missing.includes(key))
                continue;
            if (++count > limits.files) {
                files[key] = { error: `a fence may include at most ${limits.files} files` };
                continue;
            }
            const cached = lookup(key);
            if (!cached) {
                missing.push(key);
                continue;
            }
            identity.push(`${key}\u0000${cached.digest}`);
            if (cached.text === undefined) {
                files[key] = { error: cached.error ?? 'it could not be read' };
                continue;
            }
            total += cached.bytes;
            if (total > limits.totalBytes) {
                files[key] = { error: `the included files exceed ${size(limits.totalBytes)} together` };
                continue;
            }
            files[key] = cached.text;
            next.push(...includeReferences(cached.text, key, dialect));
        }
        frontier = next;
    }
    if (missing.length > 0)
        return { status: 'missing', keys: missing };
    return { status: 'ready', set: { files }, identity: identity.sort().join('\u0001') };
}
