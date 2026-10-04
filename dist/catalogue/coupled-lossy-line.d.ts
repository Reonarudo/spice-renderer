/**
 * HSPICE's coupled lossy line `W in1 … inN refin out1 … outN refout N=n L=len …`, any number of
 * conductors, nodes and parameters possibly mixed (UG p.154–158). N comes from the `N=` pair.
 */
declare const _default: {
    name: string;
    spellings: {
        dialect: "hspice";
        letter: string;
    }[];
    forms: {
        terminals: ({
            repeat: string;
            terminals: {
                name: string;
                side: "left";
            }[];
            name?: never;
            side?: never;
        } | {
            name: string;
            side: "left";
            repeat?: never;
            terminals?: never;
        } | {
            repeat: string;
            terminals: {
                name: string;
                side: "right";
            }[];
            name?: never;
            side?: never;
        } | {
            repeat?: never;
            terminals?: never;
            name: string;
            side: "right";
        })[];
        nodesEnd: "all-positional";
        counts: {
            n: {
                pair: string;
            };
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
