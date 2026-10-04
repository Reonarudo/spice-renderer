import type { ElementType } from './types.js';
/**
 * The four-terminal bulk MOSFET, `M d g s b model`. HSPICE lets the bulk be left off (taken from the
 * model's `BULK=`), so the nodes end where the model begins. The fallback for `M`: VDMOS and SOI
 * models select their own types. Spectre's bulk MOS masters spell it by name; PSP, BSIM-CMG,
 * BSIM6 and HiSIM2 are listed on the strength of their family, their terminal order being
 * unconfirmed in the public references.
 */
declare const element: ElementType;
export default element;
