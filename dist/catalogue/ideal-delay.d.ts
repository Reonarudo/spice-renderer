/** Xyce's ideal delay `YDELAY name out+ out- in+ in- TD=` (RG §2.3.27). */
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
            side: "right";
        } | {
            name: string;
            side: "left";
        })[];
        nodesEnd: "count";
    }[];
    tail: "none";
    draw: {
        block: {
            title: {
                fixed: string;
            };
        };
    };
};
export default _default;
