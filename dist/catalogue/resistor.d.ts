/**
 * `R n+ n- value` in every SPICE dialect; Spectre `resistor` with an optional third (bulk)
 * terminal. LTspice's `I … R=` "is not a current source at all, but a resistor", and `B … R=` is a
 * behavioural resistor; both are drawn as one (#1197).
 */
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
    forms: ({
        terminals: readonly import("./types.js").Terminal[];
        nodesEnd: "count";
        dialects?: never;
    } | {
        dialects: "spectre"[];
        terminals: import("./types.js").Terminal[];
        nodesEnd: "count";
    })[];
    tail: "value";
    draw: {
        symbol: string;
    };
};
export default _default;
