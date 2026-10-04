/** Xyce's TCAD device `YPDE name n1 n2 [n3 n4 …] model [params]`, two to a hundred nodes (RG §2.4). */
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
        terminals: never[];
        nodesEnd: "last-positional";
    }[];
    tail: "model";
    draw: {
        block: {
            title: "suffix";
            pins: "numbered";
        };
    };
};
export default _default;
