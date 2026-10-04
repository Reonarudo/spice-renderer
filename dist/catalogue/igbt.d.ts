/**
 * The insulated-gate bipolar transistor, `Z c g e model`: PSpice's only `Z` (model `NIGBT`), and
 * LTspice's `Z` when its model is `NIGBT` or `PIGBT` (else a MESFET).
 */
declare const _default: {
    name: string;
    spellings: ({
        dialect: "pspice";
        letter: string;
        select?: never;
    } | {
        dialect: "ltspice";
        letter: string;
        select: {
            by: "model-type";
            types: string[];
        };
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
                    nigbt: string;
                    pigbt: string;
                };
            };
        };
    };
};
export default _default;
