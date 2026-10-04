/**
 * A linear n-port described by a file or model: HSPICE `S nd1 … ndN [ref…] MNAME=m|FQMODEL=m` (SI
 * p.29), Spectre `nport (t1 b1 [t2 b2 …]) file=`, Xyce `YLIN name t1 b1 … model`. HSPICE's pins are
 * numbered because a drawing cannot tell reference nodes from port nodes without the model.
 */
declare const _default: {
    name: string;
    spellings: ({
        dialect: "hspice";
        letter: string;
        select?: never;
        master?: never;
    } | {
        dialect: "spectre";
        master: string;
        select?: never;
        letter?: never;
    } | {
        dialect: "xyce";
        letter: string;
        select: {
            by: "suffix";
            suffixes: string[];
        };
        master?: never;
    })[];
    forms: ({
        counts?: never;
        dialects: "hspice"[];
        terminals: never[];
        nodesEnd: "all-positional";
    } | {
        dialects: "spectre"[];
        terminals: {
            repeat: string;
            terminals: {
                name: string;
                side: "left";
            }[];
        }[];
        nodesEnd: "all-positional";
        counts: {
            n: "solve";
        };
    } | {
        dialects: "xyce"[];
        terminals: {
            repeat: string;
            terminals: {
                name: string;
                side: "left";
            }[];
        }[];
        nodesEnd: "last-positional";
        counts: {
            n: "solve";
        };
    })[];
    tail: "model";
    draw: {
        block: {
            title: {
                fixed: string;
            };
            pins: "numbered";
        };
    };
};
export default _default;
