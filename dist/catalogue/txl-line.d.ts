/** ngspice's single lossy line `Y n1 ref1 n2 ref2 model [len=]` (M §6.4.1). Xyce's `Y` is a device family. */
declare const _default: {
    name: string;
    spellings: {
        dialect: "ngspice";
        letter: string;
    }[];
    forms: {
        terminals: ({
            name: string;
            side: "left";
        } | {
            name: string;
            side: "right";
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
