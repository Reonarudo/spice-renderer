import type { ElementType } from './types.js';
/**
 * The uniform distributed RC line `U n1 n2 ncommon model L=len` (ngspice M §6.3, LTspice). PSpice
 * and Xyce read `U` as a digital primitive, HSPICE as a lumped lossy line.
 */
declare const element: ElementType;
export default element;
