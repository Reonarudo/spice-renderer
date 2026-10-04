/**
 * The uniform distributed RC line `U n1 n2 ncommon model L=len` (ngspice M §6.3, LTspice). PSpice
 * and Xyce read `U` as a digital primitive, HSPICE as a lumped lossy line.
 */
declare const _default: {
    name: string;
    spellings: ({
        dialect: "ngspice";
        letter: string;
    } | {
        dialect: "ltspice";
        letter: string;
    } | {
        dialect: "spectre-spice";
        letter: string;
    })[];
    forms: {
        terminals: ({
            name: string;
            side: "left";
        } | {
            name: string;
            side: "right";
        } | {
            name: string;
            side: "bottom";
        })[];
        nodesEnd: "count";
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
