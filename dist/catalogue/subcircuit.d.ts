/**
 * `X n1 … nN name [params: …] [k=v …]`: the subcircuit name is the last positional token and the
 * nodes are everything before it, matched against the `.subckt` ports (PSpice's `OPTIONAL:` pins
 * may be omitted from the right). In Spectre any master the catalogue does not name — a `subckt`,
 * an `inline subckt`, a Verilog-A module — is an instance of this type.
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
        nodesEnd: "last-positional";
    }[];
    tail: "value";
    draw: {
        block: {
            title: "master";
            pins: "subcircuit-ports";
        };
    };
};
export default _default;
