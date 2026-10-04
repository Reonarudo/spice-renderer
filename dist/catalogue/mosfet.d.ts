/**
 * The four-terminal bulk MOSFET, `M d g s b model`. HSPICE lets the bulk be left off (taken from the
 * model's `BULK=`), so the nodes end where the model begins. The fallback for `M`: VDMOS and SOI
 * models select their own types. Spectre's bulk MOS masters spell it by name; PSP, BSIM-CMG,
 * BSIM6 and HiSIM2 are listed on the strength of their family, their terminal order being
 * unconfirmed in the public references.
 */
declare const _default: {
    name: string;
    spellings: import("./types.js").Spelling[];
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
            optional: true;
        })[];
        nodesEnd: "model";
    }[];
    tail: "model";
    draw: {
        symbol: {
            default: string;
            byModelType: {
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
