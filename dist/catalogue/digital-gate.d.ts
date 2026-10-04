import type { ElementType } from './types.js';
/**
 * A single digital gate: PSpice `U name TYPE[(n)] dpwr dgnd in… out timing io` (RG p.358–359) and
 * Xyce `U name TYPE[(n)] dpwr dgnd in… out model` (RG §2.3.28). `AND`, `NAND`, `OR` and `NOR`
 * take `(n)` inputs; the rest have fixed pins. The title is the type with its parentheses.
 */
declare const element: ElementType;
export default element;
