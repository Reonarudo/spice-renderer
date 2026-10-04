/**
 * A single digital gate: PSpice `U name TYPE[(n)] dpwr dgnd in… out timing io` (RG p.358–359) and
 * Xyce `U name TYPE[(n)] dpwr dgnd in… out model` (RG §2.3.28). `AND`, `NAND`, `OR` and `NOR`
 * take `(n)` inputs; the rest have fixed pins. The title is the type with its parentheses.
 */
declare const _default: {
    name: string;
    spellings: ({
        dialect: "pspice";
        letter: string;
        select: {
            by: "keyword";
            keywords: string[];
        };
    } | {
        dialect: "xyce";
        letter: string;
        select: {
            by: "keyword";
            keywords: string[];
        };
    })[];
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
