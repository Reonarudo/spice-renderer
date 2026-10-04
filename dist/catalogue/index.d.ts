/**
 * The element catalogue (ADR 0007): every element type, keyed by its id — the file name — and the
 * lookup from a dialect's spelling to the type it names.
 */
import type { DialectId, ElementType, Spelling } from './types.js';
declare const ENTRIES: {
    readonly ammeter: ElementType;
    readonly 'behavioural-source': ElementType;
    readonly bjt: ElementType;
    readonly capacitor: ElementType;
    readonly cccs: ElementType;
    readonly ccvs: ElementType;
    readonly 'coupled-lossy-line': ElementType;
    readonly 'cpl-line': ElementType;
    readonly 'digital-adc': ElementType;
    readonly 'digital-adder': ElementType;
    readonly 'digital-constraint': ElementType;
    readonly 'digital-dac': ElementType;
    readonly 'digital-delay-line': ElementType;
    readonly 'digital-flip-flop': ElementType;
    readonly 'digital-gate': ElementType;
    readonly 'digital-gate-array': ElementType;
    readonly 'digital-input': ElementType;
    readonly 'digital-latch': ElementType;
    readonly 'digital-logic-expression': ElementType;
    readonly 'digital-output': ElementType;
    readonly 'digital-pin-delay': ElementType;
    readonly 'digital-pld': ElementType;
    readonly 'digital-pull': ElementType;
    readonly 'digital-ram': ElementType;
    readonly 'digital-rom': ElementType;
    readonly 'digital-stimulus': ElementType;
    readonly 'digital-transfer-gate': ElementType;
    readonly 'digital-tristate-gate': ElementType;
    readonly diode: ElementType;
    readonly fra: ElementType;
    readonly 'fra-probe': ElementType;
    readonly gaasfet: ElementType;
    readonly 'ibis-buffer': ElementType;
    readonly 'ideal-delay': ElementType;
    readonly igbt: ElementType;
    readonly inductor: ElementType;
    readonly isource: ElementType;
    readonly iswitch: ElementType;
    readonly jfet: ElementType;
    readonly 'lossless-line': ElementType;
    readonly 'lossy-line': ElementType;
    readonly 'ltspice-function': ElementType;
    readonly 'lumped-lossy-line': ElementType;
    readonly memristor: ElementType;
    readonly mesfet: ElementType;
    readonly mosfet: ElementType;
    readonly 'multiconductor-line': ElementType;
    readonly 'multiposition-switch': ElementType;
    readonly 'mutual-inductance': ElementType;
    readonly nport: ElementType;
    readonly 'osdi-device': ElementType;
    readonly 'pde-device': ElementType;
    readonly port: ElementType;
    readonly reluctor: ElementType;
    readonly resistor: ElementType;
    readonly 'soi-mosfet': ElementType;
    readonly subcircuit: ElementType;
    readonly transformer: ElementType;
    readonly transline: ElementType;
    readonly 'txl-line': ElementType;
    readonly 'urc-line': ElementType;
    readonly vccs: ElementType;
    readonly vcvs: ElementType;
    readonly vdmos: ElementType;
    readonly vsource: ElementType;
    readonly vswitch: ElementType;
    readonly 'xspice-model': ElementType;
    readonly 'xyce-device': ElementType;
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
