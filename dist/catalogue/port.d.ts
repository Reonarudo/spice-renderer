import type { ElementType } from './types.js';
/**
 * A two-node port for S-parameter analysis: HSPICE `P p n port=k …` (UG p.184), Xyce `P n+ n- port=k`
 * (RG §2.3.11), Spectre `port (p n) num=`. ngspice's `P` is the coupled line.
 */
declare const element: ElementType;
export default element;
