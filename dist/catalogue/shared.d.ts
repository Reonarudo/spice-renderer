/** Terminal lists several element types share. Data only, spread into entries. */
import type { Spelling, Terminal } from './types.js';
/** `n+ n-` of a two-terminal source or behavioural element. */
export declare const PLUS_MINUS: readonly Terminal[];
/** The two ends of a passive, as the resistor, capacitor and inductor symbols name them. */
export declare const A_B: readonly Terminal[];
/** A dependent source's output pair, then its controlling pair. */
export declare const CONTROLLED_SOURCE: readonly Terminal[];
/** Both ends of a transmission line: port A on the left, port B on the right. */
export declare const LINE_PORTS: readonly Terminal[];
/** The digital power and ground pins every PSpice and Xyce `U` primitive starts with. */
export declare const DIGITAL_SUPPLY: readonly Terminal[];
/** Several Spectre masters for one element type. */
export declare function spectreMasters(...masters: string[]): readonly Spelling[];
/** A letter every SPICE dialect spells the same way, Spectre's SPICE mode included. */
export declare function everySpiceDialect(letter: string): readonly Spelling[];
