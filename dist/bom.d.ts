import type { Part } from './netlist.js';
/** One reference of a BOM row: the part as written, where it is, and which included file it came from. */
export interface BomReference {
    /** The element name as written, e.g. `R1`. */
    ref: string;
    /** 1-based line the element starts on, in the fence or in `file`. */
    line: number;
    /** The included file's key, as `Prepared.files` names it; absent for the fence itself. */
    file?: string;
}
/** Every part sharing one grouping key. Quantity is `references.length`. */
export interface BomRow {
    /** The catalogue element type id, e.g. `bjt`: a stable key for styling and tests. */
    type: string;
    /** The catalogue's display name, e.g. `bipolar transistor`: the Type column. */
    name: string;
    /** The block title when the part has one: a subcircuit name, or a fixed title such as `VCVS`. */
    title?: string;
    /** The value tail as the row's first reference wrote it; may be empty. */
    value: string;
    /** In netlist order; never empty. */
    references: BomReference[];
}
/** Aggregate the parts into rows, in first-reference order; the value and title are the first reference's. */
export declare function aggregate(parts: Part[]): BomRow[];
