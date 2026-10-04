import { parseNetlist, type IncludeSet } from './netlist.js';
import type { DialectId } from './catalogue/types.js';
import { layoutSchematic, type Layout, type Symbols } from './schematic.js';
import { drawSchematic } from './draw.js';
import type { RenderResult } from './runtime.js';

/**
 * Read, lay out and draw one netlist: everything the worker does, kept free of the worker so tests
 * can call it directly. `dialect` names the parser the netlist is read with; the caller has loaded it.
 */
export async function renderNetlist(
  source: string, symbols: Symbols, layout: Layout, includes?: IncludeSet, dialect: DialectId = 'ngspice'
): Promise<RenderResult> {
  const parsed = parseNetlist(source, includes, dialect);
  if (!parsed.ok) {
    return { status: 'failure', message: parsed.message, line: parsed.line, column: parsed.column };
  }
  let schematic;
  try {
    schematic = await layoutSchematic(parsed.netlist, symbols, layout);
  } catch (error) {
    // ELK's messages are Java exception names; they are logged, and the author gets a plain one.
    const detail = error instanceof Error ? error.message : String(error);
    return { status: 'failure', message: `The schematic could not be laid out (${detail.slice(0, 200)}).` };
  }
  return { status: 'success', output: drawSchematic(schematic), notes: parsed.netlist.notes };
}
