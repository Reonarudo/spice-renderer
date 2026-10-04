/**
 * Work out which files a fence needs, from whatever is already cached: every file it includes,
 * the files those include, and so on. Kept free of I/O: `prepare` reads what this asks for.
 */
import { type IncludeSet } from './netlist.js';
import type { DialectId } from './catalogue/types.js';
/** A file as the cache holds it: its text or why it could not be read, and a digest of either. */
export interface CachedFile {
    text?: string;
    error?: string;
    /** Changes whenever the file's content or error does; cheaper to combine than the content. */
    digest: string;
    bytes: number;
}
/** At most this many files are included by one fence, all levels counted. */
export declare const MAX_FILES = 32;
/** At most this many bytes are included by one fence, all files counted. */
export declare const MAX_TOTAL_BYTES: number;
export interface ClosureLimits {
    files: number;
    totalBytes: number;
}
/** A byte count as an author reads it: whole mebibytes as `16 MB`, anything else in bytes. */
export declare function size(bytes: number): string;
export type Closure = {
    status: 'ready';
    set: IncludeSet;
    identity: string;
} | {
    status: 'missing';
    keys: string[];
};
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
export declare function closure(source: string, lookup: (key: string) => CachedFile | undefined, dialect?: DialectId, limits?: ClosureLimits): Closure;
