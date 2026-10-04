/**
 * `F n+ n- Vname gain`: the controlling source is a name, not a node, so every form has two nodes
 * (`POLY(n)`, `value=`, HSPICE `PWL(1)`, `AND(k)`, `DELAY` included). Spectre `cccs (sink src)`
 * with `probe=`, and `pcccs`.
 */
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
