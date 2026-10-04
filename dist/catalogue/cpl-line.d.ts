/**
 * ngspice's coupled multiconductor line `P in1 … inN refin out1 … outN refout model [len=]`, N
 * from 1 to 8 (M §6.4.2): the model is the last positional token and N follows from the count.
 */
declare const _default: {
    name: string;
    spellings: {
        dialect: "ngspice";
        letter: string;
    }[];
    forms: {
        terminals: ({
            repeat: string;
            terminals: {
                name: string;
                side: "left";
            }[];
            name?: never;
            side?: never;
        } | {
            name: string;
            side: "left";
            repeat?: never;
            terminals?: never;
        } | {
            repeat: string;
            terminals: {
                name: string;
                side: "right";
            }[];
            name?: never;
            side?: never;
        } | {
            repeat?: never;
            terminals?: never;
            name: string;
            side: "right";
        })[];
        nodesEnd: "last-positional";
        counts: {
            n: "solve";
        };
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
