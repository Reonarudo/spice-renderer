/**
 * Silicon-on-insulator MOSFETs take four to seven nodes: BSIMSOI `d g s e [p] [b] [t]` (ngspice
 * M §7.7, Spectre `bsimsoi`, Xyce levels 10 and 70), SOI3 `d g s bg [b] [t]`. Drawn with the
 * four-terminal symbol; the back gate takes the symbol's `B` pin and the rest are not drawn.
 */
declare const _default: {
    name: string;
    spellings: ({
        dialect: "ngspice";
        letter: string;
        select: {
            by: "model-type";
            types: string[];
            levels?: never;
        };
        master?: never;
    } | {
        dialect: "xyce";
        letter: string;
        select: {
            by: "model-type";
            types: string[];
            levels: number[];
        };
        master?: never;
    } | {
        letter?: never;
        select?: never;
        dialect: "spectre";
        master: string;
    })[];
    forms: {
        terminals: ({
            name: string;
            side: "top";
            optional?: never;
        } | {
            name: string;
            side: "left";
            optional?: never;
        } | {
            name: string;
            side: "bottom";
            optional?: never;
        } | {
            name: string;
            side: "right";
            optional?: never;
        } | {
            name: string;
            side: "right";
            optional: true;
        })[];
        nodesEnd: "model";
    }[];
    tail: "model";
    draw: {
        symbol: {
            default: string;
            byModelType: {
                psoi: string;
                pmos: string;
            };
            byModelParameter: {
                type: {
                    p: string;
                };
            };
            note: string;
        };
    };
};
export default _default;
