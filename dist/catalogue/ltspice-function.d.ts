import type { Terminal } from './types.js';
declare const _default: {
    name: string;
    spellings: {
        dialect: "ltspice";
        letter: string;
    }[];
    forms: ({
        terminals: readonly Terminal[];
        nodesEnd: "count";
        match?: never;
    } | {
        match: {
            keyword: string[];
        };
        terminals: readonly Terminal[];
        nodesEnd: "count";
    })[];
    tail: "none";
    draw: {
        block: {
            title: "keyword";
            pins: "hide-tied-to-common";
        };
    };
};
export default _default;
