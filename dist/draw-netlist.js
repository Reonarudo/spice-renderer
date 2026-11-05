import { parseNetlist } from './netlist.js';
import { layoutSchematic } from './schematic.js';
import { drawSchematic } from './draw.js';
import { aggregate } from './bom.js';
/**
 * Read, lay out and draw one netlist: everything the worker does, kept free of the worker so tests
 * can call it directly. `dialect` names the parser the netlist is read with; the caller has loaded it.
 *
 * `onParsed` is the stage boundary (docs/adr/0001): it fires once, after the netlist reader returns and
 * before layout starts, with the BOM rows and the notes. The library's worker writes them to the
 * shared buffer from it, so a layout that is cut short still leaves them behind. Internal to the
 * worker bundles; not part of the package's API.
 */
export async function renderNetlist(source, symbols, layout, includes, dialect = 'ngspice', onParsed) {
    const parsed = parseNetlist(source, includes, dialect);
    if (!parsed.ok) {
        return { status: 'failure', message: parsed.message, line: parsed.line, column: parsed.column };
    }
    const bom = aggregate(parsed.netlist.parts);
    const { notes } = parsed.netlist;
    onParsed?.({ bom, notes });
    let schematic;
    try {
        schematic = await layoutSchematic(parsed.netlist, symbols, layout);
    }
    catch (error) {
        // ELK's messages are Java exception names; they are logged, and the author gets a plain one.
        const detail = error instanceof Error ? error.message : String(error);
        return { status: 'failure', message: `The schematic could not be laid out (${detail.slice(0, 200)}).`, bom, notes };
    }
    return { status: 'success', output: drawSchematic(schematic), bom, notes };
}
