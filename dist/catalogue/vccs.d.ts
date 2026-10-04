import type { ElementType } from './types.js';
/**
 * The voltage-controlled current source: the same shapes as the VCVS with `CUR` for `VOL` and
 * PSpice's charge source `G … Q=`; HSPICE adds `VCR`, `VCCAP`, `NPWL`, `PPWL` (UG p.244–253).
 * ngspice's four-node `TABLE =` is E only. Spectre `vccs (sink src ps ns)` and `pvccs`.
 */
declare const element: ElementType;
export default element;
