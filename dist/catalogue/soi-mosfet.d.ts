import type { ElementType } from './types.js';
/**
 * Silicon-on-insulator MOSFETs take four to seven nodes: BSIMSOI `d g s e [p] [b] [t]` (ngspice
 * M §7.7, Spectre `bsimsoi`, Xyce levels 10 and 70), SOI3 `d g s bg [b] [t]`. Drawn with the
 * four-terminal symbol; the back gate takes the symbol's `B` pin and the rest are not drawn.
 */
declare const element: ElementType;
export default element;
