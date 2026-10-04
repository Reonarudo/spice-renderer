/**
 * `Q c b e [s] [tj] model`: the substrate and, for VBIC and HICUM, a thermal node are optional, so
 * the nodes end at the first token naming a defined model (ngspice M §7.3.1; Xyce writes a named
 * substrate as `[SUB]`). Spectre `bjt (c b e [s])` and `vbic (c b e [s] [dt] [tl])`. NPN unless the
 * model says otherwise: `pnp`, PSpice's lateral `lpnp`, Spectre `type=pnp`.
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
                pnp: string;
                lpnp: string;
            };
            byModelParameter: {
                type: {
                    pnp: string;
                };
            };
            note: string;
        };
    };
};
export default _default;
