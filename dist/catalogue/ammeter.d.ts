/** Spectre's current probe `iprobe (in out)`, a 0 V source that measures (REF03 p.379). */
declare const _default: {
    name: string;
    spellings: {
        dialect: "spectre";
        master: string;
    }[];
    forms: {
        terminals: ({
            name: string;
            side: "top";
        } | {
            name: string;
            side: "bottom";
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
