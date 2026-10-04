import { everySpiceDialect } from './shared.js';
/**
 * `K L1 L2 k` couples inductors by name and connects no node; Spectre `mutual_inductor` likewise
 * (`ind1= ind2=`). Noted, never drawn (#1197).
 */
const element = {
    name: 'mutual inductance',
    spellings: [...everySpiceDialect('K'), { dialect: 'spectre', master: 'mutual_inductor' }],
    forms: [{ terminals: [], nodesEnd: 'count' }],
    tail: 'value',
    draw: 'none'
};
export default element;
