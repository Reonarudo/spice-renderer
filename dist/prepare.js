import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { closure, size } from './include-closure.js';
import { MAX_INCLUDE_DEPTH } from './netlist.js';
import { parserLoader } from './parser/modules.js';
import { DEFAULT_DIALECT, DIALECT_NAMES, publicDialect } from './dialect.js';
/** The parsers `prepare` finds includes with, in this thread; the worker loads its own. */
const loadParser = parserLoader(fileURLToPath(new URL('../vendor/parsers/', import.meta.url)));
/** A limit: absent for its default, else a finite positive number. */
function limit(value, name, fallback) {
    if (value === undefined)
        return fallback;
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
        throw new TypeError(`${name} must be a finite positive number`);
    }
    return value;
}
const digest = (data) => createHash('sha256').update(data).digest('hex');
/**
 * Find the files a SPICE fence includes — and the files those include — read them through
 * `reader`, and return the render input. Resolves for anything the fence, its dialect name or its
 * files can cause, carrying the failure for `render` to report; rejects only for programmer
 * errors such as invalid limits.
 *
 * A file that cannot be read, or is over a limit, is not a failure here: it is passed on with its
 * reason, and the netlist reader reports it at the `.include` that uses it — or, for an LTspice or
 * PSpice library the simulator would find in its own folder, notes it and draws without it.
 */
export async function prepare(source, options = {}) {
    if (typeof source !== 'string')
        throw new TypeError('prepare() takes the fence body as a string');
    if (typeof options !== 'object' || options === null)
        throw new TypeError('options must be an object');
    if (options.limits !== undefined && (typeof options.limits !== 'object' || options.limits === null)) {
        throw new TypeError('limits must be an object');
    }
    const { reader } = options;
    if (reader !== undefined && typeof reader?.read !== 'function')
        throw new TypeError('reader must have a read() method');
    if (options.dialect !== undefined && typeof options.dialect !== 'string')
        throw new TypeError('dialect must be a string');
    const limits = {
        files: limit(options.limits?.files, 'limits.files', 32),
        totalBytes: limit(options.limits?.totalBytes, 'limits.totalBytes', 16 * 1024 * 1024)
    };
    const fileBytes = limit(options.limits?.fileBytes, 'limits.fileBytes', 8 * 1024 * 1024);
    const dialect = options.dialect === undefined ? DEFAULT_DIALECT : publicDialect(options.dialect);
    const identity = (dialectName, files) => digest(JSON.stringify([source, dialectName, files]));
    const failed = (message, dialectName = DEFAULT_DIALECT) => ({
        source, dialect: dialectName, files: [], identity: identity(dialectName, `failure:${message}`), failure: { message }
    });
    if (!dialect) {
        return failed(`${JSON.stringify(options.dialect)} is not a SPICE dialect; use one of ${DIALECT_NAMES.join(', ')}`);
    }
    try {
        await loadParser(dialect);
    }
    catch {
        // The loader's message would name vendor paths on this machine.
        return failed(`the ${dialect} parser could not be loaded`, dialect);
    }
    const cache = new Map();
    // Each round reads one more level of includes; the closure stops at the depth limit.
    for (let round = 0; round <= MAX_INCLUDE_DEPTH + 1; round++) {
        const found = closure(source, (key) => cache.get(key), dialect, limits);
        if (found.status === 'ready') {
            const files = Object.keys(found.set.files).sort().map((key) => {
                const entry = found.set.files[key];
                return typeof entry === 'string' ? { key, text: entry } : { key, error: entry.error };
            });
            return { source, dialect, files, identity: identity(dialect, found.identity) };
        }
        if (!reader)
            return failed('this fence includes files, but no file reader was given to read them', dialect);
        for (const key of found.keys)
            cache.set(key, await load(reader, key, fileBytes));
    }
    // Unreachable: every round caches at least one key, and the closure is bounded in depth and count.
    return failed('the included files could not be resolved', dialect);
}
/** One file through the reader, as the closure caches it. Never rejects. */
async function load(reader, key, maxBytes) {
    const refused = (error) => ({ error, bytes: 0, digest: `error:${error}` });
    let read;
    try {
        read = await reader.read(key, { maxBytes });
    }
    catch {
        return refused('the file reader failed');
    }
    if (typeof read !== 'object' || read === null)
        return refused('the file reader returned no bytes');
    if ('error' in read)
        return refused(typeof read.error === 'string' ? read.error : 'unreadable');
    const { bytes } = read;
    if (!(bytes instanceof Uint8Array))
        return refused('the file reader returned no bytes');
    if (bytes.length > maxBytes)
        return refused(`it is larger than ${size(maxBytes)}`);
    if (bytes.includes(0))
        return refused('it is not a text file');
    return { text: new TextDecoder('utf-8').decode(bytes), bytes: bytes.length, digest: digest(bytes) };
}
