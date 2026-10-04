/**
 * `D anode cathode model`; ngspice allows a third, thermal node `tj` before the model (M §7.2),
 * so the nodes end where the model begins. Spectre `diode (a c)`.
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
        terminals: import("./types.js").Terminal[];
        nodesEnd: "model";
    }[];
    tail: "model";
    draw: {
        symbol: string;
    };
};
export default _default;
