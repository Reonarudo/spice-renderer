import type { ElementType } from './types.js';
import { PLUS_MINUS, everySpiceDialect } from './shared.js';

/** `V n+ n- [specification]`; Spectre `vsource (p n)`. */
const element: ElementType = {
  name: 'voltage source',
  spellings: [...everySpiceDialect('V'), { dialect: 'spectre', master: 'vsource' }],
  forms: [{ terminals: PLUS_MINUS, nodesEnd: 'count' }],
  tail: 'value',
  draw: { symbol: 'vsource' }
};

export default element;
