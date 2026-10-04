/** PSpice's `CONSTRAINT(i)` timing checker: i inputs, no outputs, only an I/O model (RG p.409). */
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
    forms: {
        terminals: (import("./types.js").Terminal | {
            repeat: string;
            terminals: {
                name: string;
                side: "left";
            }[];
        })[];
        nodesEnd: "count";
        counts: {
            i: {
                argument: number;
            };
        };
    }[];
    tail: "model";
    draw: {
        block: {
            title: "keyword-with-arguments";
        };
    };
};
export default _default;
