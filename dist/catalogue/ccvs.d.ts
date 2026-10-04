/** `H n+ n- Vname transresistance`, two nodes in every form; Spectre `ccvs (p n)` with `probe=`, and `pccvs`. */
declare const _default: {
    name: string;
    spellings: import("./types.js").Spelling[];
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
