/**
 * The bill of materials: the parts list aggregated into rows (BOM view spec, section 3). Pure over
 * the parts the netlist reader keeps — the same list the schematic is drawn from — so the hosts
 * only draw rows and the grouping rule lives and is tested once, here.
 */
import { elementType } from './catalogue/index.js';
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

/** Case folding and whitespace collapsing: the only normalisation the key applies. */
const fold = (text: string): string => text.trim().replace(/\s+/g, ' ').toLowerCase();

/**
 * Two parts share a row when their type, title and value tail are equal after folding. The title
 * enters because a subcircuit instance's tail excludes the subcircuit name; parameters and `m=`
 * stay in the tail, so `10k tc1=0.01` and `1k m=2` are rows of their own.
 */
const key = (part: Part): string => `${part.type}\u0000${fold(part.title ?? '')}\u0000${fold(part.value)}`;

/** Aggregate the parts into rows, in first-reference order; the value and title are the first reference's. */
export function aggregate(parts: Part[]): BomRow[] {
  const rows = new Map<string, BomRow>();
  for (const part of parts) {
    const reference: BomReference = part.file === undefined
      ? { ref: part.ref, line: part.line }
      : { ref: part.ref, line: part.line, file: part.file };
    const found = rows.get(key(part));
    if (found) {
      found.references.push(reference);
      continue;
    }
    const row: BomRow = { type: part.type, name: elementType(part.type).name, value: part.value, references: [reference] };
    if (part.title !== undefined) row.title = part.title;
    rows.set(key(part), row);
  }
  return [...rows.values()];
}
