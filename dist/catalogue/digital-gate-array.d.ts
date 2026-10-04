import type { ElementType } from './types.js';
/**
 * PSpice's gate arrays and compound gates (RG p.356–359): `BUFA(g)`/`INVA(g)` have g inputs and g
 * outputs; `XORA(g)`/`NXORA(g)` 2g inputs and g outputs; `ANDA(n,g)` and kin n·g inputs and g
 * outputs; `AO(n,g)`, `OA`, `AOI`, `OAI` n·g inputs into one output.
 */
declare const element: ElementType;
export default element;
