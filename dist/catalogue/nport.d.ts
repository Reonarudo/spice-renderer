import type { ElementType } from './types.js';
/**
 * A linear n-port described by a file or model: HSPICE `S nd1 … ndN [ref…] MNAME=m|FQMODEL=m` (SI
 * p.29), Spectre `nport (t1 b1 [t2 b2 …]) file=`, Xyce `YLIN name t1 b1 … model`. HSPICE's pins are
 * numbered because a drawing cannot tell reference nodes from port nodes without the model.
 */
declare const element: ElementType;
export default element;
