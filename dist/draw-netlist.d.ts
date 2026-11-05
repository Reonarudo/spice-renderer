import { type IncludeSet } from './netlist.js';
import type { DialectId } from './catalogue/types.js';
import { type Layout, type Symbols } from './schematic.js';
import type { Parsed } from './protocol.js';
import type { RenderResult } from './runtime.js';
/**
 * Read, lay out and draw one netlist: everything the worker does, kept free of the worker so tests
 * can call it directly. `dialect` names the parser the netlist is read with; the caller has loaded it.
 *
 * `onParsed` is the stage boundary (docs/adr/0001): it fires once, after the netlist reader returns and
 * before layout starts, with the BOM rows and the notes. The library's worker writes them to the
 * shared buffer from it, so a layout that is cut short still leaves them behind. Internal to the
 * worker bundles; not part of the package's API.
 */
export declare function renderNetlist(source: string, symbols: Symbols, layout: Layout, includes?: IncludeSet, dialect?: DialectId, onParsed?: (parsed: Parsed) => void): Promise<RenderResult>;
