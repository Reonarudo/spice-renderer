import type { ElementType } from './types.js';
/**
 * `D anode cathode model`; ngspice allows a third, thermal node `tj` before the model (M §7.2),
 * so the nodes end where the model begins. Spectre `diode (a c)`.
 */
declare const element: ElementType;
export default element;
