import type { ElementType } from './types.js';
import { DIGITAL_SUPPLY } from './shared.js';

/** PSpice's `PULLUP(g)`/`PULLDN(g)` resistor arrays: g outputs and only an I/O model (RG p.377). */
const element: ElementType = {
  name: 'digital pull-up/down',
  spellings: [{ dialect: 'pspice', letter: 'U', select: { by: 'keyword', keywords: ['PULLUP', 'PULLDN'] } }],
  forms: [
    {
      terminals: [...DIGITAL_SUPPLY, { repeat: 'g', terminals: [{ name: 'out#', side: 'right' }] }],
      nodesEnd: 'count',
      counts: { g: { argument: 0 } }
    }
  ],
  tail: 'model',
  draw: { block: { title: 'keyword-with-arguments' } }
};

export default element;
