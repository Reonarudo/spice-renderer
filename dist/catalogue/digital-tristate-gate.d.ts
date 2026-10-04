/** PSpice's tristate gates (RG p.360–361): as the gates and arrays, with one enable before the outputs. */
declare const _default: {
    name: string;
    spellings: {
        dialect: "pspice";
        letter: string;
        select: {
            by: "keyword";
            keywords: string[];
        };
    }[];
    forms: ({
        match: {
            keyword: string[];
        };
        terminals: import("./types.js").Terminal[];
        nodesEnd: "count";
        counts?: never;
    } | {
        match: {
            keyword: string[];
        };
        terminals: (import("./types.js").Terminal | {
            repeat: string;
            terminals: {
                name: string;
                side: "left";
            }[];
        })[];
        nodesEnd: "count";
        counts: {
            n: {
                argument: number;
            };
            g?: never;
        };
    } | {
        match: {
            keyword: string[];
        };
        terminals: (import("./types.js").Terminal | {
            repeat: string;
            terminals: {
                name: string;
                side: "left";
            }[];
        } | {
            repeat: string;
            terminals: {
                name: string;
                side: "right";
            }[];
        })[];
        nodesEnd: "count";
        counts: {
            n?: never;
            g: {
                argument: number;
            };
        };
    } | {
        match: {
            keyword: string[];
        };
        terminals: (import("./types.js").Terminal | {
            repeat: string;
            terminals: {
                name: string;
                side: "left";
            }[];
        } | {
            repeat: string;
            terminals: {
                name: string;
                side: "right";
            }[];
        })[];
        nodesEnd: "count";
        counts: {
            n: {
                argument: number;
            };
            g: {
                argument: number;
            };
        };
    })[];
    tail: "model";
    draw: {
        block: {
            title: "keyword-with-arguments";
        };
    };
};
export default _default;
