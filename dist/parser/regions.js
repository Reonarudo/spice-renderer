/** The parser modules a netlist in `dialect` may need: a Spectre netlist may switch, so it needs both. */
export function modulesFor(dialect) {
    return dialect === 'spectre' ? ['spectre', 'spectre-spice'] : [dialect];
}
/**
 * The language a file starts in (UG p.50–51; Reference 19.1 p.493): an included file starts in
 * SPICE mode unless its name ends in `.scs`. The fence (`''`) starts in Spectre — the decision of
 * the naming ticket: a fence is read as an included `.scs` file would be, with no title line.
 */
export function startLanguage(file) {
    return file === '' || /\.scs$/i.test(file) ? 'spectre' : 'spectre-spice';
}
/** `simulator lang=spice|spectre [insensitive=yes]`; SPICE mode folds case, so the match ignores it. */
const SWITCH = /^\s*simulator(?:\s+([^\n]*))?$/i;
const LANGUAGE = /\blang\s*=\s*(spice|spectre)\b/i;
/**
 * Cut `text` into regions at its `simulator` lines. A `simulator` line that names no language
 * (`simulator lang=spectre insensitive=yes` names one; a bare `simulator` does not) keeps the
 * language and is still dropped. Regions holding only blank lines are left out.
 */
export function splitRegions(text, start) {
    const lines = text.split('\n');
    const regions = [];
    let language = start;
    let from = 0;
    const close = (to) => {
        const slice = lines.slice(from, to);
        if (slice.some((line) => line.trim() !== '')) {
            regions.push({ language, start: from + 1, lines: slice, text: '\n'.repeat(from) + slice.join('\n') + (to < lines.length ? '\n' : '') });
        }
    };
    for (const [index, raw] of lines.entries()) {
        const line = raw.replace(/\r$/, '');
        const match = SWITCH.exec(line);
        if (!match)
            continue;
        close(index);
        const named = LANGUAGE.exec(match[1] ?? '')?.[1]?.toLowerCase();
        if (named === 'spice')
            language = 'spectre-spice';
        else if (named === 'spectre')
            language = 'spectre';
        from = index + 1;
    }
    close(lines.length);
    return regions;
}
