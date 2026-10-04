/**
 * `K L1 L2 k` couples inductors by name and connects no node; Spectre `mutual_inductor` likewise
 * (`ind1= ind2=`). Noted, never drawn (#1197).
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
    forms: {
        terminals: never[];
        nodesEnd: "count";
    }[];
    tail: "value";
    draw: "none";
};
export default _default;
