import type { ElementType } from './types.js';

/** Spectre's ideal `transformer (t1 b1 t2 b2)` (REF03 p.667). */
const element: ElementType = {
  name: 'transformer',
  spellings: [{ dialect: 'spectre', master: 'transformer' }],
  forms: [
    {
      terminals: [
        { name: 't1', side: 'left' },
        { name: 'b1', side: 'left' },
        { name: 't2', side: 'right' },
        { name: 'b2', side: 'right' }
      ],
      nodesEnd: 'count'
    }
  ],
  tail: 'none',
  draw: { block: { title: { fixed: 'transformer' } } }
};

export default element;
