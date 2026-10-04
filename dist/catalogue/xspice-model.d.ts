import type { ElementType } from './types.js';
/**
 * ngspice's XSPICE code model `A port … model`: the number and kind of ports come from the model's
 * interface, the last token is the model name, and ports may be vectors `[a b]`, typed `%vd(a b)`
 * pairs, inverted `~d`, or `null` (M §8.1.1). Pins are numbered by position (#1197).
 */
declare const element: ElementType;
export default element;
