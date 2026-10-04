/**
 * A two-node port for S-parameter analysis: HSPICE `P p n port=k …` (UG p.184), Xyce `P n+ n- port=k`
 * (RG §2.3.11), Spectre `port (p n) num=`. ngspice's `P` is the coupled line.
 */
declare const _default: {
    name: string;
    spellings: ({
        master?: never;
        dialect: "hspice";
        letter: string;
    } | {
        master?: never;
        dialect: "xyce";
        letter: string;
    } | {
        letter?: never;
        dialect: "spectre";
        master: string;
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
