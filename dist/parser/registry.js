import { CONTRACT } from './contract.js';
const loaded = new Map();
/**
 * Await a dialect's module once and keep it. The module's `factory` is what `require`ing
 * `vendor/parsers/<dialect>.cjs` returns.
 */
export async function loadParser(dialect, factory) {
    if (loaded.has(dialect))
        return;
    const module = await factory();
    // A stale module fails here, once, rather than at the first netlist that trips over the difference.
    const { contract } = run(module, '');
    if (contract !== CONTRACT) {
        throw new Error(`the ${dialect} parser returns contract ${contract}; this build reads contract ${CONTRACT} — run npm run grammars`);
    }
    loaded.set(dialect, module);
}
/** Parse one file's text with the dialect's module. Throws when the dialect was never loaded. */
export function parse(dialect, text) {
    const module = loaded.get(dialect);
    if (!module)
        throw new Error(`the ${dialect} parser is not loaded`);
    return run(module, text);
}
function run(module, text) {
    const bytes = module.lengthBytesUTF8(text);
    const pointer = module._malloc(bytes + 1);
    try {
        module.stringToUTF8(text, pointer, bytes + 1);
        return JSON.parse(module.UTF8ToString(module._netlist_parse(pointer, bytes)));
    }
    finally {
        module._free(pointer);
    }
}
