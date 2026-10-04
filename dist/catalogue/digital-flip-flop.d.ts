import type { Terminal } from './types.js';
/**
 * Edge-triggered flip-flops. PSpice's take `(g)` flip-flops sharing preset, clear and clock:
 * `DFF(g)` d×g q×g qbar×g, `JKFF(g)` j×g k×g q×g qbar×g, and `DFFDE`/`JKFFDE` with positive- and
 * negative-edge enables (RG p.368). Xyce's `DFF`, `JKFF` and `TFF` are single (RG §2.3.28).
 */
declare const _default: {
    name: string;
    spellings: ({
        dialect: "pspice";
        letter: string;
        select: {
            by: "keyword";
            keywords: string[];
        };
    } | {
        dialect: "xyce";
        letter: string;
        select: {
            by: "keyword";
            keywords: string[];
        };
    })[];
    forms: ({
        match: {
            keyword: string[];
        };
        dialects: "pspice"[];
        terminals: (Terminal | {
            repeat: string;
            terminals: {
                name: string;
                side: "left";
            }[];
        } | {
            repeat: string;
            terminals: {
                name: string;
                side: "right";
            }[];
        })[];
        nodesEnd: "count";
        counts: {
            g: {
                argument: number;
            };
        };
    } | {
        match: {
            keyword: string[];
        };
        terminals: (Terminal | {
            repeat: string;
            terminals: {
                name: string;
                side: "left";
            }[];
        } | {
            repeat: string;
            terminals: {
                name: string;
                side: "right";
            }[];
        })[];
        nodesEnd: "count";
        counts: {
            g: {
                argument: number;
            };
        };
        dialects?: never;
    } | {
        counts?: never;
        match: {
            keyword: string[];
        };
        dialects: "xyce"[];
        terminals: Terminal[];
        nodesEnd: "count";
    } | {
        counts?: never;
        dialects?: never;
        match: {
            keyword: string[];
        };
        terminals: Terminal[];
        nodesEnd: "count";
    })[];
    tail: "model";
    draw: {
        block: {
            title: "keyword-with-arguments";
        };
    };
};
export default _default;
