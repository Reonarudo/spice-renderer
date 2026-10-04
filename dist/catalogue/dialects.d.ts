/**
 * Per-dialect node rules: which spellings are ground, which nodes are global, whether case
 * matters, and which element letters the dialect has. Directives are not catalogued; they belong to
 * the base grammars and their overlays.
 *
 * Sources: the dialect research on the `research/<dialect>` branches (ngspice-47 manual and source,
 * LTspice 26.1 help, PSpice A/D 16.6 reference, HSPICE B-2008.09 manuals, Xyce 7.10 reference and
 * source, Spectre 5.1/19.1 manuals).
 */
import type { DialectId } from './types.js';
export interface Dialect {
    id: DialectId;
    /** The base grammar the dialect's parser is composed from (ADR 0009): `grammar/<base>/`. */
    base: 'spice' | 'spectre';
    /** Not an accepted `dialect` value; entered only by `simulator lang=spice` inside a Spectre fence. */
    internal?: true;
    /** Spellings of the ground node, compared case-insensitively unless `caseSensitive`. */
    ground: readonly string[];
    /** Xyce: these are ground only when the netlist says `.PREPROCESS REPLACEGROUND TRUE`. */
    groundWhenReplaceGround?: readonly string[];
    /** Spectre: the first name on a `global` statement is ground too. */
    groundFromGlobal?: true;
    /** Regular expressions (source text) a node name matches when it is global by its spelling alone. */
    globalNodePatterns: readonly string[];
    /** Whether a `.global` (SPICE) or `global` (Spectre) statement also makes nodes global. */
    globalStatement: boolean;
    /** Whether node, model and subcircuit names keep their case. */
    caseSensitive: boolean;
    /** PSpice and Xyce: a node name may be written in square brackets — `Q7 c b e [SUB] model` marks a named substrate — and `[SUB]` is the node `SUB`. */
    bracketedNodeNames?: true;
    /** The element letters the dialect accepts. Empty for native Spectre, which spells by master. */
    letters: readonly string[];
    /** Spectre: masters that make a statement an analysis or control, not an element — skipped. */
    skipMasters?: readonly string[];
}
export declare const DIALECTS: Readonly<Record<DialectId, Dialect>>;
/** The dialects a fence may name, in the order the setting lists them. */
export declare const PUBLIC_DIALECTS: readonly DialectId[];
