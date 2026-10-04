import type { ElementType } from './types.js';
import { A_B, everySpiceDialect } from './shared.js';

/** `L n+ n- value` everywhere; Spectre `inductor`. HSPICE's `L … RELUCTANCE=` is the reluctor instead. */
const element: ElementType = {
  name: 'inductor',
  spellings: [...everySpiceDialect('L'), { dialect: 'spectre', master: 'inductor' }],
  forms: [{ terminals: A_B, nodesEnd: 'count' }],
  tail: 'value',
  draw: { symbol: 'inductor' }
};

export default element;
