import type { ElementType } from './types.js';
import { A_B, everySpiceDialect } from './shared.js';

/** `C n+ n- value` everywhere; Spectre `capacitor`. */
const element: ElementType = {
  name: 'capacitor',
  spellings: [...everySpiceDialect('C'), { dialect: 'spectre', master: 'capacitor' }],
  forms: [{ terminals: A_B, nodesEnd: 'count' }],
  tail: 'value',
  draw: { symbol: 'capacitor' }
};

export default element;
