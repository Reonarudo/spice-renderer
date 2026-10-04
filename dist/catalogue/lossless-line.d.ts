import type { ElementType } from './types.js';
/**
 * `T a+ a- b+ b- Z0= …`. PSpice's `T` also covers lossy lines (`LEN= R= L= G= C=` or a `TRN`
 * model) and HSPICE's may name a model; the pins are the same. Spectre `tline (t1 b1 t2 b2)`.
 */
declare const element: ElementType;
export default element;
