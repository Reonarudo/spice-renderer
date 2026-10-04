import type { ElementType } from './types.js';
import { DIGITAL_SUPPLY } from './shared.js';

/** PSpice's stimulus generators `STIM(w,format)` with w outputs and `FSTIM(k)` with k (RG p.418, 427). */
const element: ElementType = {
  name: 'digital stimulus',
  spellings: [{ dialect: 'pspice', letter: 'U', select: { by: 'keyword', keywords: ['STIM', 'FSTIM'] } }],
  forms: [
    {
      terminals: [...DIGITAL_SUPPLY, { repeat: 'w', terminals: [{ name: 'out#', side: 'right' }] }],
      nodesEnd: 'count',
      counts: { w: { argument: 0 } }
    }
  ],
  tail: 'model',
  draw: { block: { title: 'keyword-with-arguments' } }
};

export default element;
