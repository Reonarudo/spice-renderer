/**
 * `Z d g s model` in ngspice, Xyce and Spectre's SPICE mode; LTspice's `Z` is a MESFET unless its
 * model is an IGBT; Spectre `gaas (d g s)`. PSpice's `Z` is always an IGBT and HSPICE has no `Z`.
 */
declare const _default: {
    name: string;
    spellings: ({
        dialect: "ngspice";
        letter: string;
        master?: never;
    } | {
        dialect: "ltspice";
        letter: string;
        master?: never;
    } | {
        dialect: "xyce";
        letter: string;
        master?: never;
    } | {
        dialect: "spectre-spice";
        letter: string;
        master?: never;
    } | {
        letter?: never;
        dialect: "spectre";
        master: string;
    })[];
    forms: {
        terminals: ({
            name: string;
            side: "top";
        } | {
            name: string;
            side: "left";
        } | {
            name: string;
            side: "bottom";
        })[];
        nodesEnd: "model";
    }[];
    tail: "model";
    draw: {
        block: {
            title: {
                fixed: string;
            };
            polarity: {
                byModelType: {
                    nmf: string;
                    pmf: string;
                    nhfet: string;
                    phfet: string;
                };
            };
        };
    };
};
export default _default;
