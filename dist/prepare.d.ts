import { type PublicDialect } from './dialect.js';
/**
 * Reads referenced files for one Markdown file (ADR 0002). `key` is relative to that file's
 * folder, `/`-separated, never absolute. `error` is a plain author-facing reason, never a path.
 */
export interface FileReader {
    read(key: string, options: {
        maxBytes: number;
    }): Promise<{
        bytes: Uint8Array;
    } | {
        error: string;
    }>;
}
export interface PrepareOptions {
    /** Needed only when the fence includes files. */
    reader?: FileReader;
    /** The dialect the fence is read in, as the consumer resolved it; any case. Default `ngspice`. */
    dialect?: string;
    limits?: {
        /** Distinct included files per fence, every level counted; default 32. */
        files?: number;
        /** All included files of a fence together, in bytes; default 16 MiB. */
        totalBytes?: number;
        /** One included file, in bytes; default 8 MiB. */
        fileBytes?: number;
    };
}
/** One file the fence includes, by its key: its text, or why it cannot be used. */
export type IncludedFile = {
    readonly key: string;
    readonly text: string;
} | {
    readonly key: string;
    readonly error: string;
};
/**
 * The render input for one fence: what `render` takes. Produced only by `prepare`; treat it as
 * opaque. `identity` is a sha256 over the fence body, the dialect and each included file's key
 * and content (or the reason it could not be read), with no absolute path in it.
 */
export interface Prepared {
    readonly source: string;
    readonly dialect: PublicDialect;
    /** Every file reached from the fence, sorted by key. */
    readonly files: readonly IncludedFile[];
    readonly identity: string;
    /** Why the fence cannot be rendered, found during preparation; `render` reports it. */
    readonly failure?: {
        readonly message: string;
        readonly line?: number;
        readonly column?: number;
    };
}
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
export declare function prepare(source: string, options?: PrepareOptions): Promise<Prepared>;
