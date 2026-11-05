import type { PublicDialect } from './dialect.js';
import type { IncludedFile } from './prepare.js';
import type { RenderResult } from './runtime.js';
import type { BomRow } from './bom.js';
/**
 * The host and its worker share one buffer: an Int32 header, then the data region. The final reply
 * is UTF-8 JSON at the head of the data region; the parsed stage (docs/adr/0001) is UTF-8 JSON at its
 * tail, written before layout so a terminated worker still leaves the rows behind.
 */
/** What the worker is asked to draw for one fence. */
export interface Request {
    source: string;
    dialect: PublicDialect;
    files: IncludedFile[];
    outputBytes: number;
}
/** What the worker answers: a render result, and whether its engine must not be used again. */
export type Reply = RenderResult & {
    discard?: true;
};
/** What the worker leaves at the tail of the data region once the netlist has been read. */
export interface Parsed {
    bom: BomRow[];
    notes: string[];
}
/** Int32 slots at the head of the shared buffer. */
export declare const READY = 0;
export declare const LENGTH = 1;
export declare const ENGINE = 2;
/** Byte length of the parsed stage written at the tail of the data region, 0 when none. */
export declare const PARSED = 3;
/** Values of the ENGINE slot. */
export declare const STARTING = 0;
export declare const STARTED = 1;
export declare const FAILED = 2;
export declare const HEADER = 16;
