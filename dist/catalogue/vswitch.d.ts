import type { ElementType } from './types.js';
/**
 * The voltage-controlled switch `S n+ n- nc+ nc- model [on|off]`. Xyce also has the generic
 * `S n+ n- model CONTROL={expr}` with two nodes (RG §2.3.22). HSPICE's `S` is the S-parameter
 * n-port instead. Spectre `relay (1 2 ps ns)`.
 */
declare const element: ElementType;
export default element;
