/** PSpice's `B d g s model [area]`, model type `GASFET` (RG p.135, 137). Not ngspice's behavioural source. */
declare const _default: {
    name: string;
    spellings: {
        dialect: "pspice";
        letter: string;
    }[];
    forms: {
        terminals: ({
            name: string;
            side: "top";
        } | {
            name: string;
            side: "left";
        } | {
            name: string;
            side: "bottom";
        })[];
        nodesEnd: "model";
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
