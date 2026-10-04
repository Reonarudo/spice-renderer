/** Spectre's ideal `transformer (t1 b1 t2 b2)` (REF03 p.667). */
declare const _default: {
    name: string;
    spellings: {
        dialect: "spectre";
        master: string;
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
