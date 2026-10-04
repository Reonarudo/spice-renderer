import type { ElementType } from './types.js';
/**
 * `Z d g s model` in ngspice, Xyce and Spectre's SPICE mode; LTspice's `Z` is a MESFET unless its
 * model is an IGBT; Spectre `gaas (d g s)`. PSpice's `Z` is always an IGBT and HSPICE has no `Z`.
 */
declare const element: ElementType;
export default element;
