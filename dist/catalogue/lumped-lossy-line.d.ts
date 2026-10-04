/** HSPICE's lumped lossy line `U in1 [… in5] refin out1 [… out5] refout model L=` (UG p.158–159). */
declare const _default: {
    name: string;
    spellings: {
        dialect: "hspice";
        letter: string;
    }[];
    forms: {
        terminals: ({
            name?: never;
            side?: never;
            repeat: string;
            terminals: {
                name: string;
                side: "left";
            }[];
        } | {
            repeat?: never;
            terminals?: never;
            name: string;
            side: "left";
        } | {
            name?: never;
            side?: never;
            repeat: string;
            terminals: {
                name: string;
                side: "right";
            }[];
        } | {
            repeat?: never;
            terminals?: never;
            name: string;
            side: "right";
        })[];
        nodesEnd: "last-positional";
        counts: {
            n: "solve";
        };
    }[];
    tail: "model";
    draw: {
        block: {
            title: {
                fixed: string;
            };
        };
    };
};
export default _default;
