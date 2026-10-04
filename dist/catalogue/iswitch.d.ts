/** The current-controlled switch `W n+ n- Vname model [on|off]`. HSPICE's `W` is a coupled lossy line instead. */
declare const _default: {
    name: string;
    spellings: ({
        dialect: "ngspice";
        letter: string;
    } | {
        dialect: "ltspice";
        letter: string;
    } | {
        dialect: "pspice";
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
