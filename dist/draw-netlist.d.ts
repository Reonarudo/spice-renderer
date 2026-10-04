import { type IncludeSet } from './netlist.js';
import type { DialectId } from './catalogue/types.js';
import { type Layout, type Symbols } from './schematic.js';
import type { RenderResult } from './runtime.js';
/**
 * Read, lay out and draw one netlist: everything the worker does, kept free of the worker so tests
 * can call it directly. `dialect` names the parser the netlist is read with; the caller has loaded it.
 */
export declare function renderNetlist(source: string, symbols: Symbols, layout: Layout, includes?: IncludeSet, dialect?: DialectId): Promise<RenderResult>;
