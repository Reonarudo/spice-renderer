import type { ElementType } from './types.js';
/**
 * `F n+ n- Vname gain`: the controlling source is a name, not a node, so every form has two nodes
 * (`POLY(n)`, `value=`, HSPICE `PWL(1)`, `AND(k)`, `DELAY` included). Spectre `cccs (sink src)`
 * with `probe=`, and `pcccs`.
 */
declare const element: ElementType;
export default element;
