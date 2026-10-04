const SPICE3_LETTERS = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'O', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Z'];
export const DIALECTS = {
    ngspice: {
        id: 'ngspice',
        base: 'spice',
        ground: ['0', 'gnd'],
        globalNodePatterns: [],
        globalStatement: true,
        caseSensitive: false,
        letters: [...SPICE3_LETTERS, 'A', 'N', 'P', 'Y']
    },
    ltspice: {
        id: 'ltspice',
        base: 'spice',
        ground: ['0', 'gnd'],
        globalNodePatterns: ['^\\$G_'],
        globalStatement: true,
        caseSensitive: false,
        letters: [...SPICE3_LETTERS, 'A', '@', '&']
    },
    pspice: {
        id: 'pspice',
        base: 'spice',
        // PSpice documents only `0`; `gnd` is kept as ground for continuity with today's reader (unconfirmed).
        ground: ['0', 'gnd'],
        // `$D_HI`, `$D_LO` and `$D_NC` are treated as global nodes until their meaning is confirmed (#1197).
        globalNodePatterns: ['^\\$G_', '^\\$D_'],
        globalStatement: false,
        caseSensitive: false,
        bracketedNodeNames: true,
        letters: [...SPICE3_LETTERS, 'N']
    },
    hspice: {
        id: 'hspice',
        base: 'spice',
        ground: ['0', 'gnd', 'gnd!', 'ground', '!gnd'],
        globalNodePatterns: [],
        globalStatement: true,
        caseSensitive: false,
        letters: ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X']
    },
    xyce: {
        id: 'xyce',
        base: 'spice',
        ground: ['0'],
        groundWhenReplaceGround: ['gnd', 'gnd!', 'ground'],
        globalNodePatterns: ['^\\$G'],
        globalStatement: true,
        caseSensitive: false,
        // RG §2.3.17: a substrate node that is a name, not a number, is written `[SUB]`.
        bracketedNodeNames: true,
        letters: [...SPICE3_LETTERS, 'P', 'Y']
    },
    spectre: {
        id: 'spectre',
        base: 'spectre',
        ground: ['0'],
        groundFromGlobal: true,
        globalNodePatterns: [],
        globalStatement: true,
        caseSensitive: true,
        letters: [],
        skipMasters: [
            // Analyses: shaped like instances, told apart only by the master.
            'ac', 'acmatch', 'dc', 'dcmatch', 'envlp', 'hb', 'hbac', 'hbnoise', 'hbsp', 'hbstb', 'hbxf', 'lf', 'loadpull',
            'montecarlo', 'noise', 'pac', 'pdisto', 'pnoise', 'psp', 'pss', 'pstb', 'pxf', 'pz', 'qpac', 'qpnoise', 'qpsp',
            'qpss', 'qpxf', 'reliability', 'sp', 'stb', 'stress', 'sweep', 'tdr', 'thermal', 'tran', 'xf',
            // Control statements.
            'alter', 'altergroup', 'check', 'checklimit', 'cosim', 'info', 'options', 'set', 'shell', 'uti', 'fourier',
            'paramtest', 'assert', 'paramset'
        ]
    },
    'spectre-spice': {
        id: 'spectre-spice',
        base: 'spice',
        internal: true,
        ground: ['0'],
        groundFromGlobal: true,
        globalNodePatterns: [],
        globalStatement: true,
        caseSensitive: false,
        letters: SPICE3_LETTERS
    }
};
/** The dialects a fence may name, in the order the setting lists them. */
export const PUBLIC_DIALECTS = ['ngspice', 'ltspice', 'pspice', 'hspice', 'xyce', 'spectre'];
