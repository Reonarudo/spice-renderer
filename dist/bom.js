/**
 * The bill of materials: the parts list aggregated into rows (BOM view spec, section 3). Pure over
 * the parts the netlist reader keeps — the same list the schematic is drawn from — so the hosts
 * only draw rows and the grouping rule lives and is tested once, here.
 */
import { elementType } from './catalogue/index.js';
/** Case folding and whitespace collapsing: the only normalisation the key applies. */
const fold = (text) => text.trim().replace(/\s+/g, ' ').toLowerCase();
/**
 * Two parts share a row when their type, title and value tail are equal after folding. The title
 * enters because a subcircuit instance's tail excludes the subcircuit name; parameters and `m=`
 * stay in the tail, so `10k tc1=0.01` and `1k m=2` are rows of their own.
 */
const key = (part) => `${part.type}\u0000${fold(part.title ?? '')}\u0000${fold(part.value)}`;
/** Aggregate the parts into rows, in first-reference order; the value and title are the first reference's. */
export function aggregate(parts) {
    const rows = new Map();
    for (const part of parts) {
        const reference = part.file === undefined
            ? { ref: part.ref, line: part.line }
            : { ref: part.ref, line: part.line, file: part.file };
        const found = rows.get(key(part));
        if (found) {
            found.references.push(reference);
            continue;
        }
        const row = { type: part.type, name: elementType(part.type).name, value: part.value, references: [reference] };
        if (part.title !== undefined)
            row.title = part.title;
        rows.set(key(part), row);
    }
    return [...rows.values()];
}
