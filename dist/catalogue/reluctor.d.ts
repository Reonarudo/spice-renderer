/**
 * HSPICE's reluctor: `L n1+ n1- … nN+ nN- RELUCTANCE=(…)`, an even number of nodes (UG p.141–152).
 * Told from an inductor by the `RELUCTANCE=` pair.
 */
declare const _default: {
    name: string;
    spellings: {
        dialect: "hspice";
        letter: string;
        select: {
            by: "pair";
            keys: string[];
        };
    }[];
    forms: {
        terminals: {
            repeat: string;
            terminals: ({
                name: string;
                side: "left";
            } | {
                name: string;
                side: "right";
            })[];
        }[];
        nodesEnd: "all-positional";
        counts: {
            n: "solve";
        };
    }[];
    tail: "none";
    draw: {
        block: {
            title: {
                fixed: string;
            };
        };
    };
};
export default _default;
