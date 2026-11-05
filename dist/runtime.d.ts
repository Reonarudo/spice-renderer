import type { Prepared } from './prepare.js';
import type { BomRow } from './bom.js';
export interface RuntimeOptions {
    /** Milliseconds per render; default 3000. */
    timeout?: number;
    /** Milliseconds per engine start; default 10000. */
    startupTimeout?: number;
    limits?: {
        /** Whole fence body, in string length; default 64000. */
        sourceChars?: number;
        /** Success output, in UTF-8 bytes; default 4 MiB. */
        outputBytes?: number;
    };
}
/** The render input is what `prepare` returns for the fence. */
export type RenderInput = Prepared;
/**
 * `bom` holds the fence's parts aggregated into rows (see `BomRow`), `notes` what the netlist
 * reader skipped or assumed. On `failure` and `timeout` the two are present together — the netlist
 * was read, the layout was not finished — or absent together: a netlist error, a timeout inside the
 * reader, or an early payload too large for the buffer's slack (docs/adr/0001).
 */
export type RenderResult = {
    status: 'success';
    output: string;
    bom: BomRow[];
    notes: string[];
} | {
    status: 'failure';
    message: string;
    line?: number;
    column?: number;
    bom?: BomRow[];
    notes?: string[];
} | {
    status: 'timeout';
    budget: number;
    bom?: BomRow[];
    notes?: string[];
} | {
    status: 'unavailable';
    reason: string;
};
export interface Runtime {
    render(input: RenderInput): RenderResult;
    dispose(): Promise<void>;
}
/**
 * Run the netlist reader, ELK and the drawing in a worker thread that `render` blocks on.
 *
 * ELK's layered layout is superlinear in the number of parts and wires, so a large enough netlist
 * can take many seconds. A render that overruns its budget terminates the worker — the only way to
 * stop it mid-flight — and the next render starts a fresh one, so one pathological circuit costs
 * only its own fence.
 */
export declare function createRuntime(options?: RuntimeOptions): Promise<Runtime>;
