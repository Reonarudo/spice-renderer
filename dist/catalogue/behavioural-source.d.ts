/**
 * The arbitrary source `B n+ n- V=expr` or `I=expr` (ngspice M §5.1.1, LTspice, Xyce). LTspice's
 * `B … R=` is the resistor. PSpice's `B` is a GaAsFET and HSPICE's an IBIS buffer.
 */
declare const _default: {
    name: string;
    spellings: ({
        dialect: "ngspice";
        letter: string;
    } | {
        dialect: "ltspice";
        letter: string;
    } | {
        dialect: "xyce";
        letter: string;
    } | {
        dialect: "spectre-spice";
        letter: string;
    })[];
    forms: {
        terminals: readonly import("./types.js").Terminal[];
        nodesEnd: "count";
    }[];
    tail: "value";
    draw: {
        block: {
            title: {
                fixed: string;
            };
        };
    };
};
export default _default;
