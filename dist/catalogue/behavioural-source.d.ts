import type { ElementType } from './types.js';
/**
 * The arbitrary source `B n+ n- V=expr` or `I=expr` (ngspice M §5.1.1, LTspice, Xyce). LTspice's
 * `B … R=` is the resistor. PSpice's `B` is a GaAsFET and HSPICE's an IBIS buffer.
 */
declare const element: ElementType;
export default element;
