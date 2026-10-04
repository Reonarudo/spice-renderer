import type { ElementType } from './types.js';
/**
 * HSPICE's IBIS I/O buffer `B node … file='f.ibs' model='m' [buffer=n]`: the nodes end at the
 * first pair, and their names are known only when `buffer=` names the type (SI Table 20) — else
 * the empty form numbers them. The supply pins `nd_pu nd_pd nd_pc nd_gc` sit on the top and bottom
 * edges (#1197).
 */
declare const element: ElementType;
export default element;
