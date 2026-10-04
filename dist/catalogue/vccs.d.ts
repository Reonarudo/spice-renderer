/**
 * The voltage-controlled current source: the same shapes as the VCVS with `CUR` for `VOL` and
 * PSpice's charge source `G … Q=`; HSPICE adds `VCR`, `VCCAP`, `NPWL`, `PPWL` (UG p.244–253).
 * ngspice's four-node `TABLE =` is E only. Spectre `vccs (sink src ps ns)` and `pvccs`.
 */
declare const _default: {
    name: string;
    spellings: import("./types.js").Spelling[];
    forms: ({
        counts?: never;
        dialects?: never;
        terminals: readonly import("./types.js").Terminal[];
        nodesEnd: "count";
        match?: never;
    } | {
        dialects?: never;
        match: {
            keyword: string[];
            pair?: never;
        };
        terminals: ({
            name: string;
            side: "right";
            repeat?: never;
            terminals?: never;
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
        dialects?: never;
        match: {
            pair: string[];
            keyword?: never;
        };
        terminals: {
            name: string;
            side: "right";
        }[];
        nodesEnd: "count";
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
