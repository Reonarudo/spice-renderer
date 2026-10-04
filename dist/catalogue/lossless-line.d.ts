/**
 * `T a+ a- b+ b- Z0= …`. PSpice's `T` also covers lossy lines (`LEN= R= L= G= C=` or a `TRN`
 * model) and HSPICE's may name a model; the pins are the same. Spectre `tline (t1 b1 t2 b2)`.
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
        terminals: readonly import("./types.js").Terminal[];
        nodesEnd: "count";
    }[];
    tail: "value";
    draw: {
        block: {
            title: {
                fixed: string;
            };
        };
    };
};
export default _default;
