/**
 * The element catalogue (ADR 0007): every element type, keyed by its id — the file name — and the
 * lookup from a dialect's spelling to the type it names.
 */
import type { DialectId, ElementType, Select, Spelling } from './types.js';
declare const ENTRIES: {
    readonly ammeter: {
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
    readonly 'behavioural-source': {
        name: string;
        spellings: ({
            dialect: "ngspice";
            letter: string;
        } | {
            dialect: "ltspice";
            letter: string;
        } | {
            dialect: "xyce";
            letter: string;
        } | {
            dialect: "spectre-spice";
            letter: string;
        })[];
        forms: {
            terminals: readonly import("./types.js").Terminal[];
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
    readonly bjt: {
        name: string;
        spellings: ({
            dialect: "spectre";
            master: string;
        } | {
            dialect: Exclude<DialectId, 'spectre'>;
            letter: string;
            select?: Select;
        })[];
        forms: {
            terminals: ({
                name: string;
                side: "top";
                optional?: never;
            } | {
                name: string;
                side: "left";
                optional?: never;
            } | {
                name: string;
                side: "bottom";
                optional?: never;
            } | {
                name: string;
                side: "right";
                optional: true;
            })[];
            nodesEnd: "model";
        }[];
        tail: "model";
        draw: {
            symbol: {
                default: string;
                byModelType: {
                    pnp: string;
                    lpnp: string;
                };
                byModelParameter: {
                    type: {
                        pnp: string;
                    };
                };
                note: string;
            };
        };
    };
    readonly capacitor: {
        name: string;
        spellings: ({
            dialect: "spectre";
            master: string;
        } | {
            dialect: Exclude<DialectId, 'spectre'>;
            letter: string;
            select?: Select;
        })[];
        forms: {
            terminals: readonly import("./types.js").Terminal[];
            nodesEnd: "count";
        }[];
        tail: "value";
        draw: {
            symbol: string;
        };
    };
    readonly cccs: {
        name: string;
        spellings: Spelling[];
        forms: {
            terminals: readonly import("./types.js").Terminal[];
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
    readonly ccvs: {
        name: string;
        spellings: Spelling[];
        forms: {
            terminals: readonly import("./types.js").Terminal[];
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
    readonly 'coupled-lossy-line': {
        name: string;
        spellings: {
            dialect: "hspice";
            letter: string;
        }[];
        forms: {
            terminals: ({
                repeat: string;
                terminals: {
                    name: string;
                    side: "left";
                }[];
                name?: never;
                side?: never;
            } | {
                name: string;
                side: "left";
                repeat?: never;
                terminals?: never;
            } | {
                repeat: string;
                terminals: {
                    name: string;
                    side: "right";
                }[];
                name?: never;
                side?: never;
            } | {
                repeat?: never;
                terminals?: never;
                name: string;
                side: "right";
            })[];
            nodesEnd: "all-positional";
            counts: {
                n: {
                    pair: string;
                };
            };
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
    readonly 'cpl-line': {
        name: string;
        spellings: {
            dialect: "ngspice";
            letter: string;
        }[];
        forms: {
            terminals: ({
                name?: never;
                side?: never;
                repeat: string;
                terminals: {
                    name: string;
                    side: "left";
                }[];
            } | {
                repeat?: never;
                terminals?: never;
                name: string;
                side: "left";
            } | {
                name?: never;
                side?: never;
                repeat: string;
                terminals: {
                    name: string;
                    side: "right";
                }[];
            } | {
                repeat?: never;
                terminals?: never;
                name: string;
                side: "right";
            })[];
            nodesEnd: "last-positional";
            counts: {
                n: "solve";
            };
        }[];
        tail: "model";
        draw: {
            block: {
                title: {
                    fixed: string;
                };
            };
        };
    };
    readonly 'digital-adc': {
        name: string;
        spellings: {
            dialect: "pspice";
            letter: string;
            select: {
                by: "keyword";
                keywords: string[];
            };
        }[];
        forms: {
            terminals: (import("./types.js").Terminal | {
                repeat: string;
                terminals: {
                    name: string;
                    side: "right";
                }[];
            })[];
            nodesEnd: "count";
            counts: {
                b: {
                    argument: number;
                };
            };
        }[];
        tail: "model";
        draw: {
            block: {
                title: "keyword-with-arguments";
            };
        };
    };
    readonly 'digital-adder': {
        name: string;
        spellings: {
            dialect: "xyce";
            letter: string;
            select: {
                by: "keyword";
                keywords: string[];
            };
        }[];
        forms: {
            terminals: import("./types.js").Terminal[];
            nodesEnd: "count";
        }[];
        tail: "model";
        draw: {
            block: {
                title: "keyword-with-arguments";
            };
        };
    };
    readonly 'digital-constraint': {
        name: string;
        spellings: {
            dialect: "pspice";
            letter: string;
            select: {
                by: "keyword";
                keywords: string[];
            };
        }[];
        forms: {
            terminals: (import("./types.js").Terminal | {
                repeat: string;
                terminals: {
                    name: string;
                    side: "left";
                }[];
            })[];
            nodesEnd: "count";
            counts: {
                i: {
                    argument: number;
                };
            };
        }[];
        tail: "model";
        draw: {
            block: {
                title: "keyword-with-arguments";
            };
        };
    };
    readonly 'digital-dac': {
        name: string;
        spellings: {
            dialect: "pspice";
            letter: string;
            select: {
                by: "keyword";
                keywords: string[];
            };
        }[];
        forms: {
            terminals: (import("./types.js").Terminal | {
                repeat: string;
                terminals: {
                    name: string;
                    side: "left";
                }[];
            })[];
            nodesEnd: "count";
            counts: {
                b: {
                    argument: number;
                };
            };
        }[];
        tail: "model";
        draw: {
            block: {
                title: "keyword-with-arguments";
            };
        };
    };
    readonly 'digital-delay-line': {
        name: string;
        spellings: {
            dialect: "pspice";
            letter: string;
            select: {
                by: "keyword";
                keywords: string[];
            };
        }[];
        forms: {
            terminals: import("./types.js").Terminal[];
            nodesEnd: "count";
        }[];
        tail: "model";
        draw: {
            block: {
                title: "keyword-with-arguments";
            };
        };
    };
    readonly 'digital-flip-flop': {
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
            terminals: (import("./types.js").Terminal | {
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
            terminals: (import("./types.js").Terminal | {
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
            terminals: import("./types.js").Terminal[];
            nodesEnd: "count";
        } | {
            counts?: never;
            dialects?: never;
            match: {
                keyword: string[];
            };
            terminals: import("./types.js").Terminal[];
            nodesEnd: "count";
        })[];
        tail: "model";
        draw: {
            block: {
                title: "keyword-with-arguments";
            };
        };
    };
    readonly 'digital-gate': {
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
            counts?: never;
            match: {
                keyword: string[];
            };
            terminals: import("./types.js").Terminal[];
            nodesEnd: "count";
        } | {
            match: {
                keyword: string[];
            };
            terminals: (import("./types.js").Terminal | {
                repeat: string;
                terminals: {
                    name: string;
                    side: "left";
                }[];
            })[];
            nodesEnd: "count";
            counts: {
                n: {
                    argument: number;
                };
            };
        })[];
        tail: "model";
        draw: {
            block: {
                title: "keyword-with-arguments";
            };
        };
    };
    readonly 'digital-gate-array': {
        name: string;
        spellings: {
            dialect: "pspice";
            letter: string;
            select: {
                by: "keyword";
                keywords: string[];
            };
        }[];
        forms: ({
            match: {
                keyword: string[];
            };
            terminals: (import("./types.js").Terminal | {
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
                n?: never;
            };
        } | {
            match: {
                keyword: string[];
            };
            terminals: (import("./types.js").Terminal | {
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
                n: {
                    argument: number;
                };
                g: {
                    argument: number;
                };
            };
        })[];
        tail: "model";
        draw: {
            block: {
                title: "keyword-with-arguments";
            };
        };
    };
    readonly 'digital-input': {
        name: string;
        spellings: {
            dialect: "pspice";
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
        tail: "model";
        draw: {
            block: {
                title: {
                    fixed: string;
                };
            };
        };
    };
    readonly 'digital-latch': {
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
            terminals: (import("./types.js").Terminal | {
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
            terminals: (import("./types.js").Terminal | {
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
            terminals: import("./types.js").Terminal[];
            nodesEnd: "count";
        })[];
        tail: "model";
        draw: {
            block: {
                title: "keyword-with-arguments";
            };
        };
    };
    readonly 'digital-logic-expression': {
        name: string;
        spellings: {
            dialect: "pspice";
            letter: string;
            select: {
                by: "keyword";
                keywords: string[];
            };
        }[];
        forms: {
            terminals: (import("./types.js").Terminal | {
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
                i: {
                    argument: number;
                };
                o: {
                    argument: number;
                };
            };
        }[];
        tail: "model";
        draw: {
            block: {
                title: "keyword-with-arguments";
            };
        };
    };
    readonly 'digital-output': {
        name: string;
        spellings: {
            dialect: "pspice";
            letter: string;
        }[];
        forms: {
            terminals: {
                name: string;
                side: "left";
            }[];
            nodesEnd: "count";
        }[];
        tail: "model";
        draw: {
            block: {
                title: {
                    fixed: string;
                };
            };
        };
    };
    readonly 'digital-pin-delay': {
        name: string;
        spellings: {
            dialect: "pspice";
            letter: string;
            select: {
                by: "keyword";
                keywords: string[];
            };
        }[];
        forms: {
            terminals: (import("./types.js").Terminal | {
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
                p: {
                    argument: number;
                };
                e: {
                    argument: number;
                };
                r: {
                    argument: number;
                };
            };
        }[];
        tail: "model";
        draw: {
            block: {
                title: "keyword-with-arguments";
            };
        };
    };
    readonly 'digital-pld': {
        name: string;
        spellings: {
            dialect: "pspice";
            letter: string;
            select: {
                by: "keyword";
                keywords: string[];
            };
        }[];
        forms: {
            terminals: (import("./types.js").Terminal | {
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
                i: {
                    argument: number;
                };
                o: {
                    argument: number;
                };
            };
        }[];
        tail: "model";
        draw: {
            block: {
                title: "keyword-with-arguments";
            };
        };
    };
    readonly 'digital-pull': {
        name: string;
        spellings: {
            dialect: "pspice";
            letter: string;
            select: {
                by: "keyword";
                keywords: string[];
            };
        }[];
        forms: {
            terminals: (import("./types.js").Terminal | {
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
        }[];
        tail: "model";
        draw: {
            block: {
                title: "keyword-with-arguments";
            };
        };
    };
    readonly 'digital-ram': {
        name: string;
        spellings: {
            dialect: "pspice";
            letter: string;
            select: {
                by: "keyword";
                keywords: string[];
            };
        }[];
        forms: {
            terminals: (import("./types.js").Terminal | {
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
                a: {
                    argument: number;
                };
                d: {
                    argument: number;
                };
            };
        }[];
        tail: "model";
        draw: {
            block: {
                title: "keyword-with-arguments";
            };
        };
    };
    readonly 'digital-rom': {
        name: string;
        spellings: {
            dialect: "pspice";
            letter: string;
            select: {
                by: "keyword";
                keywords: string[];
            };
        }[];
        forms: {
            terminals: (import("./types.js").Terminal | {
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
                a: {
                    argument: number;
                };
                o: {
                    argument: number;
                };
            };
        }[];
        tail: "model";
        draw: {
            block: {
                title: "keyword-with-arguments";
            };
        };
    };
    readonly 'digital-stimulus': {
        name: string;
        spellings: {
            dialect: "pspice";
            letter: string;
            select: {
                by: "keyword";
                keywords: string[];
            };
        }[];
        forms: {
            terminals: (import("./types.js").Terminal | {
                repeat: string;
                terminals: {
                    name: string;
                    side: "right";
                }[];
            })[];
            nodesEnd: "count";
            counts: {
                w: {
                    argument: number;
                };
            };
        }[];
        tail: "model";
        draw: {
            block: {
                title: "keyword-with-arguments";
            };
        };
    };
    readonly 'digital-transfer-gate': {
        name: string;
        spellings: {
            dialect: "pspice";
            letter: string;
            select: {
                by: "keyword";
                keywords: string[];
            };
        }[];
        forms: {
            terminals: import("./types.js").Terminal[];
            nodesEnd: "count";
        }[];
        tail: "model";
        draw: {
            block: {
                title: "keyword-with-arguments";
            };
        };
    };
    readonly 'digital-tristate-gate': {
        name: string;
        spellings: {
            dialect: "pspice";
            letter: string;
            select: {
                by: "keyword";
                keywords: string[];
            };
        }[];
        forms: ({
            counts?: never;
            match: {
                keyword: string[];
            };
            terminals: import("./types.js").Terminal[];
            nodesEnd: "count";
        } | {
            match: {
                keyword: string[];
            };
            terminals: (import("./types.js").Terminal | {
                repeat: string;
                terminals: {
                    name: string;
                    side: "left";
                }[];
            })[];
            nodesEnd: "count";
            counts: {
                n: {
                    argument: number;
                };
                g?: never;
            };
        } | {
            match: {
                keyword: string[];
            };
            terminals: (import("./types.js").Terminal | {
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
                n?: never;
                g: {
                    argument: number;
                };
            };
        } | {
            match: {
                keyword: string[];
            };
            terminals: (import("./types.js").Terminal | {
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
                n: {
                    argument: number;
                };
                g: {
                    argument: number;
                };
            };
        })[];
        tail: "model";
        draw: {
            block: {
                title: "keyword-with-arguments";
            };
        };
    };
    readonly diode: {
        name: string;
        spellings: ({
            dialect: "spectre";
            master: string;
        } | {
            dialect: Exclude<DialectId, 'spectre'>;
            letter: string;
            select?: Select;
        })[];
        forms: {
            terminals: import("./types.js").Terminal[];
            nodesEnd: "model";
        }[];
        tail: "model";
        draw: {
            symbol: string;
        };
    };
    readonly fra: {
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
    readonly 'fra-probe': {
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
    readonly gaasfet: {
        name: string;
        spellings: {
            dialect: "pspice";
            letter: string;
        }[];
        forms: {
            terminals: ({
                name: string;
                side: "top";
            } | {
                name: string;
                side: "left";
            } | {
                name: string;
                side: "bottom";
            })[];
            nodesEnd: "model";
        }[];
        tail: "model";
        draw: {
            block: {
                title: {
                    fixed: string;
                };
            };
        };
    };
    readonly 'ibis-buffer': {
        name: string;
        spellings: {
            dialect: "hspice";
            letter: string;
        }[];
        forms: ({
            terminals: never[];
            nodesEnd: "all-positional";
            match?: never;
        } | {
            match: {
                pair: string[];
                values: string[];
            };
            terminals: import("./types.js").Terminal[];
            nodesEnd: "all-positional";
        })[];
        tail: "none";
        draw: {
            block: {
                title: {
                    fixed: string;
                };
            };
        };
    };
    readonly 'ideal-delay': {
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
    readonly igbt: {
        name: string;
        spellings: ({
            dialect: "pspice";
            letter: string;
            select?: never;
        } | {
            dialect: "ltspice";
            letter: string;
            select: {
                by: "model-type";
                types: string[];
            };
        })[];
        forms: {
            terminals: ({
                name: string;
                side: "top";
            } | {
                name: string;
                side: "left";
            } | {
                name: string;
                side: "bottom";
            })[];
            nodesEnd: "model";
        }[];
        tail: "model";
        draw: {
            block: {
                title: {
                    fixed: string;
                };
                polarity: {
                    byModelType: {
                        nigbt: string;
                        pigbt: string;
                    };
                };
            };
        };
    };
    readonly inductor: {
        name: string;
        spellings: ({
            dialect: "spectre";
            master: string;
        } | {
            dialect: Exclude<DialectId, 'spectre'>;
            letter: string;
            select?: Select;
        })[];
        forms: {
            terminals: readonly import("./types.js").Terminal[];
            nodesEnd: "count";
        }[];
        tail: "value";
        draw: {
            symbol: string;
        };
    };
    readonly isource: {
        name: string;
        spellings: ({
            dialect: "spectre";
            master: string;
        } | {
            dialect: Exclude<DialectId, 'spectre'>;
            letter: string;
            select?: Select;
        })[];
        forms: {
            terminals: readonly import("./types.js").Terminal[];
            nodesEnd: "count";
        }[];
        tail: "value";
        draw: {
            symbol: string;
        };
    };
    readonly iswitch: {
        name: string;
        spellings: ({
            dialect: "ngspice";
            letter: string;
        } | {
            dialect: "ltspice";
            letter: string;
        } | {
            dialect: "pspice";
            letter: string;
        } | {
            dialect: "xyce";
            letter: string;
        } | {
            dialect: "spectre-spice";
            letter: string;
        })[];
        forms: {
            terminals: readonly import("./types.js").Terminal[];
            nodesEnd: "count";
        }[];
        tail: "model";
        draw: {
            block: {
                title: {
                    fixed: string;
                };
            };
        };
    };
    readonly jfet: {
        name: string;
        spellings: ({
            dialect: "spectre";
            master: string;
        } | {
            dialect: Exclude<DialectId, 'spectre'>;
            letter: string;
            select?: Select;
        })[];
        forms: {
            terminals: ({
                optional?: never;
                name: string;
                side: "top";
            } | {
                optional?: never;
                name: string;
                side: "left";
            } | {
                optional?: never;
                name: string;
                side: "bottom";
            } | {
                name: string;
                side: "right";
                optional: true;
            })[];
            nodesEnd: "model";
        }[];
        tail: "model";
        draw: {
            block: {
                title: {
                    fixed: string;
                };
                polarity: {
                    byModelType: {
                        njf: string;
                        pjf: string;
                    };
                };
            };
        };
    };
    readonly 'lossless-line': {
        name: string;
        spellings: ({
            dialect: "spectre";
            master: string;
        } | {
            dialect: Exclude<DialectId, 'spectre'>;
            letter: string;
            select?: Select;
        })[];
        forms: {
            terminals: readonly import("./types.js").Terminal[];
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
    readonly 'lossy-line': {
        name: string;
        spellings: ({
            dialect: "ngspice";
            letter: string;
        } | {
            dialect: "ltspice";
            letter: string;
        } | {
            dialect: "xyce";
            letter: string;
        } | {
            dialect: "spectre-spice";
            letter: string;
        })[];
        forms: {
            terminals: readonly import("./types.js").Terminal[];
            nodesEnd: "count";
        }[];
        tail: "model";
        draw: {
            block: {
                title: {
                    fixed: string;
                };
            };
        };
    };
    readonly 'ltspice-function': {
        name: string;
        spellings: {
            dialect: "ltspice";
            letter: string;
        }[];
        forms: ({
            match?: never;
            terminals: readonly import("./types.js").Terminal[];
            nodesEnd: "count";
        } | {
            match: {
                keyword: string[];
            };
            terminals: readonly import("./types.js").Terminal[];
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
    readonly 'lumped-lossy-line': {
        name: string;
        spellings: {
            dialect: "hspice";
            letter: string;
        }[];
        forms: {
            terminals: ({
                name?: never;
                side?: never;
                repeat: string;
                terminals: {
                    name: string;
                    side: "left";
                }[];
            } | {
                repeat?: never;
                terminals?: never;
                name: string;
                side: "left";
            } | {
                name?: never;
                side?: never;
                repeat: string;
                terminals: {
                    name: string;
                    side: "right";
                }[];
            } | {
                repeat?: never;
                terminals?: never;
                name: string;
                side: "right";
            })[];
            nodesEnd: "last-positional";
            counts: {
                n: "solve";
            };
        }[];
        tail: "model";
        draw: {
            block: {
                title: {
                    fixed: string;
                };
            };
        };
    };
    readonly memristor: {
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
            terminals: readonly import("./types.js").Terminal[];
            nodesEnd: "count";
        }[];
        tail: "model";
        draw: {
            block: {
                title: {
                    fixed: string;
                };
            };
        };
    };
    readonly mesfet: {
        name: string;
        spellings: ({
            dialect: "ngspice";
            letter: string;
            master?: never;
        } | {
            dialect: "ltspice";
            letter: string;
            master?: never;
        } | {
            dialect: "xyce";
            letter: string;
            master?: never;
        } | {
            dialect: "spectre-spice";
            letter: string;
            master?: never;
        } | {
            letter?: never;
            dialect: "spectre";
            master: string;
        })[];
        forms: {
            terminals: ({
                name: string;
                side: "top";
            } | {
                name: string;
                side: "left";
            } | {
                name: string;
                side: "bottom";
            })[];
            nodesEnd: "model";
        }[];
        tail: "model";
        draw: {
            block: {
                title: {
                    fixed: string;
                };
                polarity: {
                    byModelType: {
                        nmf: string;
                        pmf: string;
                        nhfet: string;
                        phfet: string;
                    };
                };
            };
        };
    };
    readonly mosfet: {
        name: string;
        spellings: Spelling[];
        forms: {
            terminals: ({
                optional?: never;
                name: string;
                side: "top";
            } | {
                optional?: never;
                name: string;
                side: "left";
            } | {
                optional?: never;
                name: string;
                side: "bottom";
            } | {
                name: string;
                side: "right";
                optional: true;
            })[];
            nodesEnd: "model";
        }[];
        tail: "model";
        draw: {
            symbol: {
                default: string;
                byModelType: {
                    pmos: string;
                };
                byModelParameter: {
                    type: {
                        p: string;
                    };
                };
                note: string;
            };
        };
    };
    readonly 'multiconductor-line': {
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
    readonly 'multiposition-switch': {
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
    readonly 'mutual-inductance': {
        name: string;
        spellings: ({
            dialect: "spectre";
            master: string;
        } | {
            dialect: Exclude<DialectId, 'spectre'>;
            letter: string;
            select?: Select;
        })[];
        forms: {
            terminals: never[];
            nodesEnd: "count";
        }[];
        tail: "value";
        draw: "none";
    };
    readonly nport: {
        name: string;
        spellings: ({
            select?: never;
            master?: never;
            dialect: "hspice";
            letter: string;
        } | {
            select?: never;
            letter?: never;
            dialect: "spectre";
            master: string;
        } | {
            master?: never;
            dialect: "xyce";
            letter: string;
            select: {
                by: "suffix";
                suffixes: string[];
            };
        })[];
        forms: ({
            counts?: never;
            dialects: "hspice"[];
            terminals: never[];
            nodesEnd: "all-positional";
        } | {
            dialects: "spectre"[];
            terminals: {
                repeat: string;
                terminals: {
                    name: string;
                    side: "left";
                }[];
            }[];
            nodesEnd: "all-positional";
            counts: {
                n: "solve";
            };
        } | {
            dialects: "xyce"[];
            terminals: {
                repeat: string;
                terminals: {
                    name: string;
                    side: "left";
                }[];
            }[];
            nodesEnd: "last-positional";
            counts: {
                n: "solve";
            };
        })[];
        tail: "model";
        draw: {
            block: {
                title: {
                    fixed: string;
                };
                pins: "numbered";
            };
        };
    };
    readonly 'osdi-device': {
        name: string;
        spellings: {
            dialect: "ngspice";
            letter: string;
        }[];
        forms: {
            terminals: never[];
            nodesEnd: "last-positional";
        }[];
        tail: "model";
        draw: {
            block: {
                title: "model-type";
                pins: "numbered";
            };
        };
    };
    readonly 'pde-device': {
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
    readonly port: {
        name: string;
        spellings: ({
            master?: never;
            dialect: "hspice";
            letter: string;
        } | {
            master?: never;
            dialect: "xyce";
            letter: string;
        } | {
            letter?: never;
            dialect: "spectre";
            master: string;
        })[];
        forms: {
            terminals: readonly import("./types.js").Terminal[];
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
    readonly reluctor: {
        name: string;
        spellings: {
            dialect: "hspice";
            letter: string;
            select: {
                by: "pair";
                keys: string[];
            };
        }[];
        forms: {
            terminals: {
                repeat: string;
                terminals: ({
                    name: string;
                    side: "left";
                } | {
                    name: string;
                    side: "right";
                })[];
            }[];
            nodesEnd: "all-positional";
            counts: {
                n: "solve";
            };
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
    readonly resistor: {
        name: string;
        spellings: ({
            dialect: "spectre";
            master: string;
        } | {
            dialect: Exclude<DialectId, 'spectre'>;
            letter: string;
            select?: Select;
        })[];
        forms: ({
            dialects?: never;
            terminals: readonly import("./types.js").Terminal[];
            nodesEnd: "count";
        } | {
            dialects: "spectre"[];
            terminals: import("./types.js").Terminal[];
            nodesEnd: "count";
        })[];
        tail: "value";
        draw: {
            symbol: string;
        };
    };
    readonly 'soi-mosfet': {
        name: string;
        spellings: ({
            master?: never;
            dialect: "ngspice";
            letter: string;
            select: {
                by: "model-type";
                types: string[];
                levels?: never;
            };
        } | {
            master?: never;
            dialect: "xyce";
            letter: string;
            select: {
                by: "model-type";
                types: string[];
                levels: number[];
            };
        } | {
            select?: never;
            letter?: never;
            dialect: "spectre";
            master: string;
        })[];
        forms: {
            terminals: ({
                optional?: never;
                name: string;
                side: "top";
            } | {
                optional?: never;
                name: string;
                side: "left";
            } | {
                optional?: never;
                name: string;
                side: "bottom";
            } | {
                optional?: never;
                name: string;
                side: "right";
            } | {
                name: string;
                side: "right";
                optional: true;
            })[];
            nodesEnd: "model";
        }[];
        tail: "model";
        draw: {
            symbol: {
                default: string;
                byModelType: {
                    psoi: string;
                    pmos: string;
                };
                byModelParameter: {
                    type: {
                        p: string;
                    };
                };
                note: string;
            };
        };
    };
    readonly subcircuit: {
        name: string;
        spellings: ({
            dialect: "spectre";
            master: string;
        } | {
            dialect: Exclude<DialectId, 'spectre'>;
            letter: string;
            select?: Select;
        })[];
        forms: {
            terminals: never[];
            nodesEnd: "last-positional";
        }[];
        tail: "value";
        draw: {
            block: {
                title: "master";
                pins: "subcircuit-ports";
            };
        };
    };
    readonly transformer: {
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
    readonly transline: {
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
                side: "left";
            } | {
                name: string;
                side: "right";
            })[];
            nodesEnd: "count";
        }[];
        tail: "model";
        draw: {
            block: {
                title: {
                    fixed: string;
                };
            };
        };
    };
    readonly 'txl-line': {
        name: string;
        spellings: {
            dialect: "ngspice";
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
        tail: "model";
        draw: {
            block: {
                title: {
                    fixed: string;
                };
            };
        };
    };
    readonly 'urc-line': {
        name: string;
        spellings: ({
            dialect: "ngspice";
            letter: string;
        } | {
            dialect: "ltspice";
            letter: string;
        } | {
            dialect: "spectre-spice";
            letter: string;
        })[];
        forms: {
            terminals: ({
                name: string;
                side: "left";
            } | {
                name: string;
                side: "right";
            } | {
                name: string;
                side: "bottom";
            })[];
            nodesEnd: "count";
        }[];
        tail: "model";
        draw: {
            block: {
                title: {
                    fixed: string;
                };
            };
        };
    };
    readonly vccs: {
        name: string;
        spellings: Spelling[];
        forms: ({
            counts?: never;
            dialects?: never;
            match?: never;
            terminals: readonly import("./types.js").Terminal[];
            nodesEnd: "count";
        } | {
            dialects?: never;
            match: {
                keyword: string[];
                pair?: never;
            };
            terminals: ({
                repeat?: never;
                terminals?: never;
                name: string;
                side: "right";
            } | {
                name?: never;
                side?: never;
                repeat: string;
                terminals: {
                    name: string;
                    side: "left";
                }[];
            })[];
            nodesEnd: "count";
            counts: {
                n: {
                    argument: number;
                    default: number;
                };
            };
        } | {
            counts?: never;
            match: {
                keyword: string[];
                pair?: never;
            };
            dialects: ("ltspice" | "ngspice" | "pspice" | "spectre-spice" | "xyce")[];
            terminals: {
                name: string;
                side: "right";
            }[];
            nodesEnd: "count";
        } | {
            counts?: never;
            dialects?: never;
            match: {
                pair: string[];
                keyword?: never;
            };
            terminals: {
                name: string;
                side: "right";
            }[];
            nodesEnd: "count";
        } | {
            counts?: never;
            match: {
                pair?: never;
                keyword: string[];
            };
            dialects: "hspice"[];
            terminals: readonly import("./types.js").Terminal[];
            nodesEnd: "count";
        } | {
            counts?: never;
            dialects?: never;
            match: {
                pair?: never;
                keyword: string[];
            };
            terminals: readonly import("./types.js").Terminal[];
            nodesEnd: "count";
        })[];
        tail: "value";
        draw: {
            block: {
                title: {
                    fixed: string;
                };
            };
        };
    };
    readonly vcvs: {
        name: string;
        spellings: Spelling[];
        forms: ({
            counts?: never;
            dialects?: never;
            match?: never;
            terminals: readonly import("./types.js").Terminal[];
            nodesEnd: "count";
        } | {
            dialects?: never;
            match: {
                pair?: never;
                keyword: string[];
            };
            terminals: ({
                repeat?: never;
                terminals?: never;
                name: string;
                side: "right";
            } | {
                name?: never;
                side?: never;
                repeat: string;
                terminals: {
                    name: string;
                    side: "left";
                }[];
            })[];
            nodesEnd: "count";
            counts: {
                n: {
                    argument: number;
                    default: number;
                };
            };
        } | {
            counts?: never;
            match: {
                pair?: never;
                keyword: string[];
            };
            dialects: ("ltspice" | "ngspice" | "pspice" | "spectre-spice" | "xyce")[];
            terminals: {
                name: string;
                side: "right";
            }[];
            nodesEnd: "count";
        } | {
            counts?: never;
            dialects?: never;
            match: {
                keyword?: never;
                pair: string[];
            };
            terminals: {
                name: string;
                side: "right";
            }[];
            nodesEnd: "count";
        } | {
            counts?: never;
            match: {
                pair?: never;
                keyword: string[];
            };
            dialects: "hspice"[];
            terminals: readonly import("./types.js").Terminal[];
            nodesEnd: "count";
        } | {
            counts?: never;
            dialects?: never;
            match: {
                pair?: never;
                keyword: string[];
            };
            terminals: readonly import("./types.js").Terminal[];
            nodesEnd: "count";
        })[];
        tail: "value";
        draw: {
            block: {
                title: {
                    fixed: string;
                };
            };
        };
    };
    readonly vdmos: {
        name: string;
        spellings: ({
            dialect: "ngspice";
            letter: string;
            select: {
                levels?: never;
                by: "model-type";
                types: string[];
            };
        } | {
            dialect: "ltspice";
            letter: string;
            select: {
                levels?: never;
                by: "model-type";
                types: string[];
            };
        } | {
            dialect: "xyce";
            letter: string;
            select: {
                by: "model-type";
                types: string[];
                levels: number[];
            };
        })[];
        forms: {
            terminals: ({
                optional?: never;
                name: string;
                side: "top";
            } | {
                optional?: never;
                name: string;
                side: "left";
            } | {
                optional?: never;
                name: string;
                side: "bottom";
            } | {
                name: string;
                side: "right";
                optional: true;
            })[];
            nodesEnd: "model";
        }[];
        tail: "model";
        draw: {
            symbol: {
                default: string;
                byModelType: {
                    vdmosp: string;
                    pmos: string;
                };
                byModelFlag: {
                    pchan: string;
                };
                note: string;
            };
        };
    };
    readonly vsource: {
        name: string;
        spellings: ({
            dialect: "spectre";
            master: string;
        } | {
            dialect: Exclude<DialectId, 'spectre'>;
            letter: string;
            select?: Select;
        })[];
        forms: {
            terminals: readonly import("./types.js").Terminal[];
            nodesEnd: "count";
        }[];
        tail: "value";
        draw: {
            symbol: string;
        };
    };
    readonly vswitch: {
        name: string;
        spellings: ({
            master?: never;
            dialect: "ngspice";
            letter: string;
        } | {
            master?: never;
            dialect: "ltspice";
            letter: string;
        } | {
            master?: never;
            dialect: "pspice";
            letter: string;
        } | {
            master?: never;
            dialect: "xyce";
            letter: string;
        } | {
            master?: never;
            dialect: "spectre-spice";
            letter: string;
        } | {
            letter?: never;
            dialect: "spectre";
            master: string;
        })[];
        forms: ({
            dialects?: never;
            match?: never;
            terminals: readonly import("./types.js").Terminal[];
            nodesEnd: "count";
        } | {
            match: {
                pair: string[];
            };
            dialects: "xyce"[];
            terminals: {
                name: string;
                side: "right";
            }[];
            nodesEnd: "count";
        })[];
        tail: "model";
        draw: {
            block: {
                title: {
                    fixed: string;
                };
            };
        };
    };
    readonly 'xspice-model': {
        name: string;
        spellings: {
            dialect: "ngspice";
            letter: string;
        }[];
        forms: {
            terminals: never[];
            nodesEnd: "last-positional";
        }[];
        tail: "model";
        draw: {
            block: {
                title: "model-type";
                pins: "xspice-ports";
            };
        };
    };
    readonly 'xyce-device': {
        name: string;
        spellings: {
            dialect: "xyce";
            letter: string;
        }[];
        forms: {
            terminals: never[];
            nodesEnd: "all-positional";
        }[];
        tail: "none";
        draw: {
            block: {
                title: "suffix";
                pins: "numbered";
            };
        };
    };
};
/** An element type's id: the name of its file in `src/catalogue/`. */
export type ElementTypeId = keyof typeof ENTRIES;
/** Every element type by id. */
export declare const CATALOGUE: Readonly<Record<ElementTypeId, ElementType>>;
export declare const ELEMENT_TYPE_IDS: ElementTypeId[];
export declare function elementType(id: ElementTypeId): ElementType;
/** What is known about an element when its type is looked up; every hint is optional. */
export interface SpellingHints {
    /** Its model's `.model` type, lower-cased, when the model is defined. */
    modelType?: string;
    /** The model's `LEVEL`, when given. */
    modelLevel?: number;
    /** The Xyce `Y` suffix, upper-cased. */
    suffix?: string;
    /** Keyword tokens on the line, upper-cased. */
    keywords?: readonly string[];
    /** The keys of `key=value` pairs on the line, upper-cased. */
    pairKeys?: readonly string[];
}
/** Every (type, spelling) pair of one dialect. */
export declare function spellingsOf(dialect: DialectId): {
    id: ElementTypeId;
    spelling: Spelling;
}[];
/**
 * The element type a SPICE dialect's letter names, given what the line and its model say. Types
 * whose selector matches win over the letter's fallback; `undefined` when the dialect has no such
 * letter.
 */
export declare function elementTypeForLetter(dialect: Exclude<DialectId, 'spectre'>, letter: string, hints?: SpellingHints): ElementTypeId | undefined;
/** The element type a Spectre master names; a master the catalogue does not know is a subcircuit or module. */
export declare function elementTypeForMaster(master: string): ElementTypeId;
export {};
