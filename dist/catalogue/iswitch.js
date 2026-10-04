import { PLUS_MINUS } from './shared.js';
/** The current-controlled switch `W n+ n- Vname model [on|off]`. HSPICE's `W` is a coupled lossy line instead. */
const element = {
    name: 'current-controlled switch',
    spellings: [
        { dialect: 'ngspice', letter: 'W' },
        { dialect: 'ltspice', letter: 'W' },
        { dialect: 'pspice', letter: 'W' },
        { dialect: 'xyce', letter: 'W' },
        { dialect: 'spectre-spice', letter: 'W' }
    ],
    forms: [{ terminals: PLUS_MINUS, nodesEnd: 'count' }],
    tail: 'model',
    draw: { block: { title: { fixed: 'switch' } } }
};
export default element;
