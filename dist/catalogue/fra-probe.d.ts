/** LTspice's FRA probe `&name o+ o- i+ i-` (four nodes, no parameters). */
declare const _default: {
    name: string;
    spellings: {
        dialect: "ltspice";
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
