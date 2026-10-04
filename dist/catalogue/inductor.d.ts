/** `L n+ n- value` everywhere; Spectre `inductor`. HSPICE's `L … RELUCTANCE=` is the reluctor instead. */
declare const _default: {
    name: string;
    spellings: ({
        dialect: "spectre";
        master: string;
    } | {
        dialect: Exclude<import("./types.js").DialectId, 'spectre'>;
        letter: string;
        select?: import("./types.js").Select;
    })[];
    forms: {
        terminals: readonly import("./types.js").Terminal[];
        nodesEnd: "count";
    }[];
    tail: "value";
    draw: {
        symbol: string;
    };
};
export default _default;
