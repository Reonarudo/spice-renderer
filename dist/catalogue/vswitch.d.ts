/**
 * The voltage-controlled switch `S n+ n- nc+ nc- model [on|off]`. Xyce also has the generic
 * `S n+ n- model CONTROL={expr}` with two nodes (RG §2.3.22). HSPICE's `S` is the S-parameter
 * n-port instead. Spectre `relay (1 2 ps ns)`.
 */
declare const _default: {
    name: string;
    spellings: ({
        dialect: "ngspice";
        letter: string;
        master?: never;
    } | {
        dialect: "ltspice";
        letter: string;
        master?: never;
    } | {
        dialect: "pspice";
        letter: string;
        master?: never;
    } | {
        dialect: "xyce";
        letter: string;
        master?: never;
    } | {
        dialect: "spectre-spice";
        letter: string;
        master?: never;
    } | {
        letter?: never;
        dialect: "spectre";
        master: string;
    })[];
    forms: ({
        dialects?: never;
        terminals: readonly import("./types.js").Terminal[];
        nodesEnd: "count";
        match?: never;
    } | {
        match: {
            pair: string[];
        };
        dialects: "xyce"[];
        terminals: {
            name: string;
            side: "right";
        }[];
        nodesEnd: "count";
    })[];
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
