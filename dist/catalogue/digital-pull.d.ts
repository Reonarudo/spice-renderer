/** PSpice's `PULLUP(g)`/`PULLDN(g)` resistor arrays: g outputs and only an I/O model (RG p.377). */
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
                side: "right";
            }[];
        })[];
        nodesEnd: "count";
        counts: {
            g: {
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
