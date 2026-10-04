/** Spectre's current probe `iprobe (in out)`, a 0 V source that measures (REF03 p.379). */
const element = {
    name: 'ammeter',
    spellings: [{ dialect: 'spectre', master: 'iprobe' }],
    forms: [{ terminals: [{ name: 'in', side: 'top' }, { name: 'out', side: 'bottom' }], nodesEnd: 'count' }],
    tail: 'none',
    draw: { block: { title: { fixed: 'ammeter' } } }
};
export default element;
