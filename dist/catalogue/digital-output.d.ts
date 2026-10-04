/** PSpice's analog-to-digital interface `O interface reference model DGTLNET=net iomodel` (RG p.439–441). */
declare const _default: {
    name: string;
    spellings: {
        dialect: "pspice";
        letter: string;
    }[];
    forms: {
        terminals: {
            name: string;
            side: "left";
        }[];
        nodesEnd: "count";
    }[];
    tail: "model";
    draw: {
        block: {
            title: {
                fixed: string;
            };
        };
    };
};
export default _default;
