import type { ElementType } from './types.js';

/** LTspice's frequency response analyzer `@name in out [zm] fstart= fend= …` (two nodes). */
const element: ElementType = {
  name: 'FRA',
  spellings: [{ dialect: 'ltspice', letter: '@' }],
  forms: [{ terminals: [{ name: 'in', side: 'left' }, { name: 'out', side: 'right' }], nodesEnd: 'count' }],
  tail: 'value',
  draw: { block: { title: { fixed: 'FRA' } } }
};

export default element;
