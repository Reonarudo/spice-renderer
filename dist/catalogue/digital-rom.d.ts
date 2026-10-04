/** PSpice's `ROM(a,o)`: enable, a address lines (msb first), o outputs (RG p.384). */
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
        } | {
            repeat: string;
            terminals: {
                name: string;
                side: "right";
            }[];
        })[];
        nodesEnd: "count";
        counts: {
            a: {
                argument: number;
            };
            o: {
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
