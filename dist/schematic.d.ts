/**
 * Turn a netlist into a laid-out schematic: every part becomes a symbol with its pins at fixed
 * positions, every node becomes wires between pins, and ELK decides where everything goes.
 *
 * The graph construction and the wire clean-up after layout are adapted from netlistsvg
 * (MIT, Copyright (c) 2016 Neil Turley; `lib/elkGraph.ts` and `lib/drawModule.ts`). Its
 * Yosys-specific machinery — bit vectors, constants, splits and joins, module hierarchy — is not
 * needed for SPICE and was left behind.
 */
import { type Element } from '@xmldom/xmldom';
import type { ElkNode, ElkPoint } from 'elkjs/lib/elk-api.js';
import { type Netlist, type Part, type Side } from './netlist.js';
export type { Side };
export interface SymbolPin {
    x: number;
    y: number;
    side: Side;
}
/** One symbol from `symbols.svg`. */
export interface SchematicSymbol {
    type: string;
    width: number;
    height: number;
    pins: Map<string, SymbolPin>;
    /** The `<g>` to clone when drawing; null for a block, which is drawn in code. */
    template: Element | null;
    /** Where the symbol's `ref` and `value` texts sit, for reserving room around it; a block's `title` and a net label's `net` too. */
    labels: {
        attribute: 'ref' | 'value' | 'title' | 'net';
        x: number;
        y: number;
        anchor: 'start' | 'middle' | 'end';
    }[];
}
export type Symbols = Map<string, SchematicSymbol>;
/** A symbol placed on the page: a part's, a ground symbol's, or a net label's with the node it names. */
export interface Placed {
    part: Part | undefined;
    /** For a net label: the global node's name. */
    label?: string;
    symbol: SchematicSymbol;
    x: number;
    y: number;
}
export interface Wire {
    points: ElkPoint[];
}
export interface Schematic {
    placed: Placed[];
    wires: Wire[];
    junctions: ElkPoint[];
    /** The drawing's extent, labels included. */
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
export type Layout = (graph: ElkNode) => Promise<ElkNode>;
/** Text is measured as 10 px Courier: 6 px per character, 11 px from baseline to ascender. */
export declare const CHAR_WIDTH = 6;
/** Labels longer than this are cut with an ellipsis; a long SIN(…) would otherwise dwarf the part. */
export declare const MAX_LABEL = 24;
/** Read `symbols.svg`. Throws if the file is not the shape this module expects. */
export declare function loadSymbols(svg: string): Symbols;
/** Shorten a label to what is drawn. */
export declare function labelText(text: string): string;
/**
 * A block's symbol, built to fit: pins on the edge the catalogue's side names — supplies on the top
 * and bottom, inputs left, outputs right — and pins the netlist names by position split between
 * left and right in netlist order; the box wide enough for its title and pin names, and a row taller
 * at the top or bottom when pins sit there, so their names fit inside.
 */
export declare function blockSymbol(part: Part): SchematicSymbol;
interface Box {
    left: number;
    top: number;
    right: number;
    bottom: number;
}
/**
 * Lay out a netlist. Ground is drawn where it is used: every connection to node 0 gets its own
 * ground symbol, as a hand-drawn schematic would, rather than one net wired across the page. A
 * global node likewise: every connection to one gets its own net label, hanging above the pin —
 * or standing below a pin on a bottom edge — and naming the node.
 */
export declare function layoutSchematic(netlist: Netlist, symbols: Symbols, layout: Layout): Promise<Schematic>;
/** The extent of a symbol and its labels, relative to the symbol's origin; `label` is a net label's node name. */
export declare function labelBox(symbol: SchematicSymbol, part: Part | undefined, label?: string): Box;
/** What one of a symbol's texts says for this placement, as drawn, or empty when there is nothing to say. */
export declare function labelTextFor(entry: SchematicSymbol['labels'][number], part: Part | undefined, label?: string): string;
