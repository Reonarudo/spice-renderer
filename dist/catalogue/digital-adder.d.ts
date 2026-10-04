/** Xyce's full adder `U name ADD dpwr dgnd a b cin sum cout model` — three inputs, two outputs (RG §2.3.28). */
declare const _default: {
    name: string;
    spellings: {
        dialect: "xyce";
        letter: string;
        select: {
            by: "keyword";
            keywords: string[];
        };
    }[];
    forms: {
        terminals: import("./types.js").Terminal[];
        nodesEnd: "count";
    }[];
    tail: "model";
    draw: {
        block: {
            title: "keyword-with-arguments";
        };
    };
};
export default _default;
