import type { ElementType } from './types.js';
/**
 * HSPICE's coupled lossy line `W in1 … inN refin out1 … outN refout N=n L=len …`, any number of
 * conductors, nodes and parameters possibly mixed (UG p.154–158). N comes from the `N=` pair.
 */
declare const element: ElementType;
export default element;
