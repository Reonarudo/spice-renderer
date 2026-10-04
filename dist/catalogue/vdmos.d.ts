/**
 * The vertical double-diffused power MOSFET has three terminals, `M d g s model`, plus two
 * thermal nodes `tj tc` with the `thermal` flag in ngspice (M §7.7). LTspice writes its model
 * `VDMOS(… pchan)`, ngspice `vdmos pchan` or `vdmosp`; Xyce uses NMOS/PMOS level 18. Drawn with
 * the three-pin symbol, P-channel when the model says so (#1197).
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
    } | {
        dialect: "ltspice";
        letter: string;
        select: {
            by: "model-type";
            types: string[];
            levels?: never;
        };
    } | {
        dialect: "xyce";
        letter: string;
        select: {
            by: "model-type";
            types: string[];
            levels: number[];
        };
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
            optional: true;
        })[];
        nodesEnd: "model";
    }[];
    tail: "model";
    draw: {
        symbol: {
            default: string;
            byModelType: {
                vdmosp: string;
                pmos: string;
            };
            byModelFlag: {
                pchan: string;
            };
            note: string;
        };
    };
};
export default _default;
