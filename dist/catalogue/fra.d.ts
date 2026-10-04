/** LTspice's frequency response analyzer `@name in out [zm] fstart= fend= …` (two nodes). */
declare const _default: {
    name: string;
    spellings: {
        dialect: "ltspice";
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
    tail: "value";
    draw: {
        block: {
            title: {
                fixed: string;
            };
        };
    };
};
export default _default;
