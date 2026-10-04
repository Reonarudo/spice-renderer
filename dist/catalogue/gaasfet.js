/** PSpice's `B d g s model [area]`, model type `GASFET` (RG p.135, 137). Not ngspice's behavioural source. */
const element = {
    name: 'GaAsFET',
    spellings: [{ dialect: 'pspice', letter: 'B' }],
    forms: [
        {
            terminals: [
                { name: 'D', side: 'top' },
                { name: 'G', side: 'left' },
                { name: 'S', side: 'bottom' }
            ],
            nodesEnd: 'model'
        }
    ],
    tail: 'model',
    draw: { block: { title: { fixed: 'GaAsFET' } } }
};
export default element;
