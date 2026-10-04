/** Xyce's `YMEMRISTOR name n+ n- model` (RG §2.3.32). */
declare const _default: {
    name: string;
    spellings: {
        dialect: "xyce";
        letter: string;
        select: {
            by: "suffix";
            suffixes: string[];
        };
    }[];
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
