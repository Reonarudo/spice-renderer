/** The LTRA lossy line `O a+ a- b+ b- model`. PSpice's `O` is a digital output and HSPICE has no `O`. */
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
