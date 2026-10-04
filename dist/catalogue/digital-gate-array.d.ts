/**
 * PSpice's gate arrays and compound gates (RG p.356–359): `BUFA(g)`/`INVA(g)` have g inputs and g
 * outputs; `XORA(g)`/`NXORA(g)` 2g inputs and g outputs; `ANDA(n,g)` and kin n·g inputs and g
 * outputs; `AO(n,g)`, `OA`, `AOI`, `OAI` n·g inputs into one output.
 */
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
    forms: ({
        match: {
            keyword: string[];
        };
        terminals: (import("./types.js").Terminal | {
            repeat: string;
            terminals: {
                name: string;
                side: "left";
            }[];
        } | {
            repeat: string;
            terminals: {
                name: string;
                side: "right";
            }[];
        })[];
        nodesEnd: "count";
        counts: {
            g: {
                argument: number;
            };
            n?: never;
        };
    } | {
        match: {
            keyword: string[];
        };
        terminals: (import("./types.js").Terminal | {
            repeat: string;
            terminals: {
                name: string;
                side: "left";
            }[];
        } | {
            repeat: string;
            terminals: {
                name: string;
                side: "right";
            }[];
        })[];
        nodesEnd: "count";
        counts: {
            n: {
                argument: number;
            };
            g: {
                argument: number;
            };
        };
    })[];
    tail: "model";
    draw: {
        block: {
            title: "keyword-with-arguments";
        };
    };
};
export default _default;
