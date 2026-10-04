/** PSpice's bidirectional transfer gates `NBTG`/`PBTG`: gate, channel 1, channel 2 (RG p.363). */
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
