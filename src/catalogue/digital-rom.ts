import type { ElementType } from './types.js';
import { DIGITAL_SUPPLY } from './shared.js';

/** PSpice's `ROM(a,o)`: enable, a address lines (msb first), o outputs (RG p.384). */
const element: ElementType = {
  name: 'digital ROM',
  spellings: [{ dialect: 'pspice', letter: 'U', select: { by: 'keyword', keywords: ['ROM'] } }],
  forms: [
    {
      terminals: [
        ...DIGITAL_SUPPLY,
        { name: 'EN', side: 'left' },
        { repeat: 'a', terminals: [{ name: 'A#', side: 'left' }] },
        { repeat: 'o', terminals: [{ name: 'out#', side: 'right' }] }
      ],
      nodesEnd: 'count',
      counts: { a: { argument: 0 }, o: { argument: 1 } }
    }
  ],
  tail: 'model',
  draw: { block: { title: 'keyword-with-arguments' } }
};

export default element;
