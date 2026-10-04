import type { Terminal } from './types.js';
/**
 * Gated latches: PSpice `SRFF(g)` s×g r×g q×g qbar×g and `DLTCH(g)` d×g q×g qbar×g sharing preset,
 * clear and gate (RG p.374); Xyce's single `DLTCH` with enable (RG §2.3.28).
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
        dialects?: never;
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
    } | {
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
        counts?: never;
        match: {
            keyword: string[];
        };
        dialects: "xyce"[];
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
