import type { ElementType } from './types.js';
/**
 * `R n+ n- value` in every SPICE dialect; Spectre `resistor` with an optional third (bulk)
 * terminal. LTspice's `I … R=` "is not a current source at all, but a resistor", and `B … R=` is a
 * behavioural resistor; both are drawn as one (#1197).
 */
declare const element: ElementType;
export default element;
