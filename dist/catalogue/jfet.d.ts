/**
 * `J d g s [b] model`: HSPICE and Spectre (`jfet (d g s [b])`) allow a fourth, bulk node. A block
 * until a JFET symbol exists; `njf`/`pjf` name the polarity in the title.
 */
declare const _default: {
    name: string;
    spellings: ({
        dialect: "spectre";
        master: string;
    } | {
        dialect: Exclude<import("./types.js").DialectId, 'spectre'>;
        letter: string;
        select?: import("./types.js").Select;
    })[];
    forms: {
        terminals: ({
            optional?: never;
            name: string;
            side: "top";
        } | {
            optional?: never;
            name: string;
            side: "left";
        } | {
            optional?: never;
            name: string;
            side: "bottom";
        } | {
            name: string;
            side: "right";
            optional: true;
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
                    njf: string;
                    pjf: string;
                };
            };
        };
    };
};
export default _default;
