/**
 * The voltage-controlled voltage source has more shapes than any other element. The token after
 * the two output nodes decides:
 * - a node: the linear `E n+ n- nc+ nc- gain` (every dialect), also after a `VCVS` keyword;
 * - `POLY(n)`: 2n controlling nodes (bare `POLY` is `POLY(1)` in HSPICE); ngspice and HSPICE
 *   gates `AND(n)`, `OR(n)`, `NAND(n)`, `NOR(n)` likewise;
 * - an expression keyword — `VALUE`, `VOL`, `TABLE`, `LAPLACE`, `FREQ`, `CHEBYSHEV`, `NOISE` — or a
 *   `value=`/`vol=`/`F=` pair: two nodes only (ngspice M §5.2, PSpice RG p.165–176, LTspice, Xyce);
 * - in HSPICE the keyword forms keep four nodes with the keyword between the pairs (UG p.226–240),
 *   and only `VOL=` and `NOISE=` are two-node.
 * Spectre `vcvs (p n ps ns)` and the polynomial `pvcvs`.
 */
declare const _default: {
    name: string;
    spellings: import("./types.js").Spelling[];
    forms: ({
        counts?: never;
        terminals: readonly import("./types.js").Terminal[];
        nodesEnd: "count";
        dialects?: never;
        match?: never;
    } | {
        match: {
            keyword: string[];
            pair?: never;
        };
        terminals: ({
            repeat?: never;
            terminals?: never;
            name: string;
            side: "right";
        } | {
            name?: never;
            side?: never;
            repeat: string;
            terminals: {
                name: string;
                side: "left";
            }[];
        })[];
        nodesEnd: "count";
        counts: {
            n: {
                argument: number;
                default: number;
            };
        };
        dialects?: never;
    } | {
        counts?: never;
        match: {
            keyword: string[];
            pair?: never;
        };
        dialects: ("ltspice" | "ngspice" | "pspice" | "spectre-spice" | "xyce")[];
        terminals: {
            name: string;
            side: "right";
        }[];
        nodesEnd: "count";
    } | {
        counts?: never;
        match: {
            pair: string[];
            keyword?: never;
        };
        terminals: {
            name: string;
            side: "right";
        }[];
        nodesEnd: "count";
        dialects?: never;
    } | {
        counts?: never;
        match: {
            pair?: never;
            keyword: string[];
        };
        dialects: "hspice"[];
        terminals: readonly import("./types.js").Terminal[];
        nodesEnd: "count";
    } | {
        counts?: never;
        dialects?: never;
        match: {
            pair?: never;
            keyword: string[];
        };
        terminals: readonly import("./types.js").Terminal[];
        nodesEnd: "count";
    })[];
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
