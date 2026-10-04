/** Xyce's lumped transmission line `YTRANSLINE name in out model len= lumps=` (RG §2.3.26). */
declare const _default: {
    name: string;
    spellings: {
        dialect: "xyce";
        letter: string;
        select: {
            by: "suffix";
            suffixes: string[];
        };
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
