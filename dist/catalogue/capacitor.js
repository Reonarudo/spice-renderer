import { A_B, everySpiceDialect } from './shared.js';
/** `C n+ n- value` everywhere; Spectre `capacitor`. */
export default {
    name: 'capacitor',
    spellings: [...everySpiceDialect('C'), { dialect: 'spectre', master: 'capacitor' }],
    forms: [{ terminals: A_B, nodesEnd: 'count' }],
    tail: 'value',
    draw: { symbol: 'capacitor' }
};
