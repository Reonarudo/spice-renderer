import { type ElementTypeId } from './catalogue/index.js';
import type { DialectId, Side } from './catalogue/types.js';
export type { Side };
export type { ElementTypeId };
export type Kind = 'resistor' | 'capacitor' | 'inductor' | 'diode' | 'vsource' | 'isource' | 'npn' | 'pnp' | 'nmos' | 'pmos'
/** Anything drawn as a labelled box: subcircuit instances, dependent sources, switches, … */
 | 'block';
export interface Pin {
    /** The symbol's pin id, e.g. `A`, `+`, `C`, or the subcircuit's port name. */
    name: string;
    /** Normalised node name: lower case, and `0` for every spelling of ground. */
    node: string;
    /** For a block pin: the edge the catalogue's terminal puts it on. Absent when the netlist names the pin by position. */
    side?: Side;
    /** Unused by the element's definition — an LTspice `A` pin tied to its common — and not drawn. */
    hidden?: true;
}
export interface Part {
    /** The element name as written, e.g. `R1`. */
    ref: string;
    /** The element type from the catalogue, e.g. `vcvs`; `kind` is what is drawn for it. */
    type: ElementTypeId;
    kind: Kind;
    pins: Pin[];
    /** Everything after the nodes, e.g. `10k`, `SIN(0 1 1k)` or a model name. May be empty. */
    value: string;
    /** For a block: what it is, e.g. the subcircuit name or `VCVS`. */
    title?: string;
    /** 1-based source line the element starts on. */
    line: number;
    /** The included file the element comes from; absent for the fence itself. */
    file?: string;
}
export interface Netlist {
    parts: Part[];
    /**
     * Global nodes, normalised as pins name them: those a `.global` (Spectre `global`) statement
     * declares, in order, then those global by their spelling (`$G_…`), in order of first use. Ground
     * is never one. Every connection to one is drawn as a net label, as ground is as a ground symbol.
     */
    globals: string[];
    /** Things skipped or assumed, for the output channel. Never shown in the preview. */
    notes: string[];
}
export type ParseResult = {
    ok: true;
    netlist: Netlist;
} | {
    ok: false;
    message: string;
    line: number;
    column: number;
};
/**
 * The files a netlist may include, keyed as in `include-paths.ts`. An entry that could not be read
 * carries why; it is an error only if the netlist actually includes it.
 */
export interface IncludeSet {
    files: Record<string, string | {
        error: string;
    }>;
    /** Set when no file could be read at all, saying why; every include is then noted and skipped. */
    unavailable?: string;
}
/** Includes nested deeper than this are refused, as a cycle the key check missed would be. */
export declare const MAX_INCLUDE_DEPTH = 8;
/** The node every spelling of ground is normalised to. */
export declare const GROUND = "0";
/** More parts than this cannot be laid out legibly, and would only run into the time limit. */
export declare const MAX_PARTS = 400;
/**
 * Read a netlist. `includes` supplies the files `.include` and `.lib` name; without it, every
 * include is noted and skipped. `dialect` names the generated parser the netlist is read with
 * (ADR 0008); whoever calls this first must have loaded that parser into the registry.
 */
export declare function parseNetlist(source: string, includes?: IncludeSet, dialect?: DialectId): ParseResult;
/**
 * The keys of every file a text includes, directly — for the loader, which follows them to load
 * the whole closure. Never throws; a malformed text simply yields what was found before the fault.
 */
export declare function includeReferences(text: string, from: string, dialect?: DialectId): string[];
