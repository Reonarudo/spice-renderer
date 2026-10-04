import type { ElementType } from './types.js';
/**
 * HSPICE's reluctor: `L n1+ n1- … nN+ nN- RELUCTANCE=(…)`, an even number of nodes (UG p.141–152).
 * Told from an inductor by the `RELUCTANCE=` pair.
 */
declare const element: ElementType;
export default element;
