import { PLUS_MINUS, everySpiceDialect } from './shared.js';
/** `I n+ n- [specification]`; Spectre `isource (sink src)`. LTspice's `I … R=` is the resistor. */
const element = {
    name: 'current source',
    spellings: [...everySpiceDialect('I'), { dialect: 'spectre', master: 'isource' }],
    forms: [{ terminals: PLUS_MINUS, nodesEnd: 'count' }],
    tail: 'value',
    draw: { symbol: 'isource' }
};
export default element;
