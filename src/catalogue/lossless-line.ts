import type { ElementType } from './types.js';
import { LINE_PORTS, everySpiceDialect } from './shared.js';

/**
 * `T a+ a- b+ b- Z0= …`. PSpice's `T` also covers lossy lines (`LEN= R= L= G= C=` or a `TRN`
 * model) and HSPICE's may name a model; the pins are the same. Spectre `tline (t1 b1 t2 b2)`.
 */
const element: ElementType = {
  name: 'transmission line',
  spellings: [...everySpiceDialect('T'), { dialect: 'spectre', master: 'tline' }],
  forms: [{ terminals: LINE_PORTS, nodesEnd: 'count' }],
  tail: 'value',
  draw: { block: { title: { fixed: 'line' } } }
};

export default element;
