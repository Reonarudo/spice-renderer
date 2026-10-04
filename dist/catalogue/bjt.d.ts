import type { ElementType } from './types.js';
/**
 * `Q c b e [s] [tj] model`: the substrate and, for VBIC and HICUM, a thermal node are optional, so
 * the nodes end at the first token naming a defined model (ngspice M §7.3.1; Xyce writes a named
 * substrate as `[SUB]`). Spectre `bjt (c b e [s])` and `vbic (c b e [s] [dt] [tl])`. NPN unless the
 * model says otherwise: `pnp`, PSpice's lateral `lpnp`, Spectre `type=pnp`.
 */
declare const element: ElementType;
export default element;
