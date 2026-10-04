/** PSpice's digital-to-analog interface `N interface low high model DGTLNET=net iomodel` (RG p.434–436). */
declare const _default: {
    name: string;
    spellings: {
        dialect: "pspice";
        letter: string;
    }[];
    forms: {
        terminals: ({
            name: string;
            side: "right";
        } | {
            name: string;
            side: "left";
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
