/** PSpice's stimulus generators `STIM(w,format)` with w outputs and `FSTIM(k)` with k (RG p.418, 427). */
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
            w: {
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
