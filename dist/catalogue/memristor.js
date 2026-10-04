import { PLUS_MINUS } from './shared.js';
/** Xyce's `YMEMRISTOR name n+ n- model` (RG §2.3.32). */
export default {
    name: 'memristor',
    spellings: [{ dialect: 'xyce', letter: 'Y', select: { by: 'suffix', suffixes: ['MEMRISTOR'] } }],
    forms: [{ terminals: PLUS_MINUS, nodesEnd: 'count' }],
    tail: 'model',
    draw: { block: { title: { fixed: 'memristor' } } }
};
