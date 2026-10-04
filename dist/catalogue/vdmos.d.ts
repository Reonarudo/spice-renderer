import type { ElementType } from './types.js';
/**
 * The vertical double-diffused power MOSFET has three terminals, `M d g s model`, plus two
 * thermal nodes `tj tc` with the `thermal` flag in ngspice (M §7.7). LTspice writes its model
 * `VDMOS(… pchan)`, ngspice `vdmos pchan` or `vdmosp`; Xyce uses NMOS/PMOS level 18. Drawn with
 * the three-pin symbol, P-channel when the model says so (#1197).
 */
declare const element: ElementType;
export default element;
