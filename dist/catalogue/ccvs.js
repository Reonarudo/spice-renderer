import { PLUS_MINUS, everySpiceDialect, spectreMasters } from './shared.js';
/** `H n+ n- Vname transresistance`, two nodes in every form; Spectre `ccvs (p n)` with `probe=`, and `pccvs`. */
const element = {
    name: 'CCVS',
    spellings: [...everySpiceDialect('H'), ...spectreMasters('ccvs', 'pccvs')],
    forms: [{ terminals: PLUS_MINUS, nodesEnd: 'count' }],
    tail: 'value',
    draw: { block: { title: { fixed: 'CCVS' } } }
};
export default element;
