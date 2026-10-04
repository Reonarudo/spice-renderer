/** Spectre's multiconductor line `mtline`, with as many terminals as the line has conductors (REF03 p.576). */
declare const _default: {
    name: string;
    spellings: {
        dialect: "spectre";
        master: string;
    }[];
    forms: {
        terminals: never[];
        nodesEnd: "all-positional";
    }[];
    tail: "none";
    draw: {
        block: {
            title: {
                fixed: string;
            };
            pins: "numbered";
        };
    };
};
export default _default;
