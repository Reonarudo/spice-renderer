import type { ElementType } from './types.js';
/**
 * The voltage-controlled voltage source has more shapes than any other element. The token after
 * the two output nodes decides:
 * - a node: the linear `E n+ n- nc+ nc- gain` (every dialect), also after a `VCVS` keyword;
 * - `POLY(n)`: 2n controlling nodes (bare `POLY` is `POLY(1)` in HSPICE); ngspice and HSPICE
 *   gates `AND(n)`, `OR(n)`, `NAND(n)`, `NOR(n)` likewise;
 * - an expression keyword — `VALUE`, `VOL`, `TABLE`, `LAPLACE`, `FREQ`, `CHEBYSHEV`, `NOISE` — or a
 *   `value=`/`vol=`/`F=` pair: two nodes only (ngspice M §5.2, PSpice RG p.165–176, LTspice, Xyce);
 * - in HSPICE the keyword forms keep four nodes with the keyword between the pairs (UG p.226–240),
 *   and only `VOL=` and `NOISE=` are two-node.
 * Spectre `vcvs (p n ps ns)` and the polynomial `pvcvs`.
 */
declare const element: ElementType;
export default element;
