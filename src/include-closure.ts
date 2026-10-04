/**
 * Work out which files a fence needs, from whatever is already cached: every file it includes,
 * the files those include, and so on. Kept free of I/O: `prepare` reads what this asks for.
 */
import { includeReferences, MAX_INCLUDE_DEPTH, type IncludeSet } from './netlist.js';
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
export const MAX_FILES = 32;
/** At most this many bytes are included by one fence, all files counted. */
export const MAX_TOTAL_BYTES = 16 * 1024 * 1024;

export interface ClosureLimits {
  files: number;
  totalBytes: number;
}

/** A byte count as an author reads it: whole mebibytes as `16 MB`, anything else in bytes. */
export function size(bytes: number): string {
  return bytes % (1024 * 1024) === 0 ? `${bytes / 1024 / 1024} MB` : `${bytes} bytes`;
}

export type Closure =
  | { status: 'ready'; set: IncludeSet; identity: string }
  | { status: 'missing'; keys: string[] };

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
export function closure(
  source: string,
  lookup: (key: string) => CachedFile | undefined,
  dialect: DialectId = 'ngspice',
  limits: ClosureLimits = { files: MAX_FILES, totalBytes: MAX_TOTAL_BYTES }
): Closure {
  const files: IncludeSet['files'] = {};
  const identity: string[] = [];
  const missing: string[] = [];
  let frontier = includeReferences(source, '', dialect);
  let total = 0;
  let count = 0;
  for (let depth = 0; frontier.length > 0 && depth <= MAX_INCLUDE_DEPTH; depth++) {
    const next: string[] = [];
    for (const key of frontier) {
      if (Object.hasOwn(files, key) || missing.includes(key)) continue;
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
  if (missing.length > 0) return { status: 'missing', keys: missing };
  return { status: 'ready', set: { files }, identity: identity.sort().join('\u0001') };
}
