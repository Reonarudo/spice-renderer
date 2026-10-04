import { Worker } from 'node:worker_threads';
import { publicDialect } from './dialect.js';
import { ENGINE, FAILED, HEADER, LENGTH, READY, STARTED, STARTING } from './protocol.js';
/** Whether a value has the shape `prepare` gives, so the worker is never handed anything else. */
function isPrepared(input) {
    if (typeof input !== 'object' || input === null)
        return false;
    const { source, dialect, files, identity, failure } = input;
    return typeof source === 'string' && publicDialect(dialect) === dialect &&
        typeof identity === 'string' && /^[0-9a-f]{64}$/.test(identity) &&
        (failure === undefined || (typeof failure === 'object' && failure !== null &&
            typeof failure.message === 'string')) &&
        Array.isArray(files) && files.every((file) => {
        const { key, text, error } = (file ?? {});
        return typeof key === 'string' && (typeof text === 'string') !== (typeof error === 'string');
    }) && new Set(files.map((file) => file.key)).size === files.length;
}
/** A runtime-wide option: absent for its default, else a finite positive number. */
function option(value, name, fallback) {
    if (value === undefined)
        return fallback;
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
        throw new TypeError(`${name} must be a finite positive number`);
    }
    return value;
}
/**
 * Run the netlist reader, ELK and the drawing in a worker thread that `render` blocks on.
 *
 * ELK's layered layout is superlinear in the number of parts and wires, so a large enough netlist
 * can take many seconds. A render that overruns its budget terminates the worker — the only way to
 * stop it mid-flight — and the next render starts a fresh one, so one pathological circuit costs
 * only its own fence.
 */
export async function createRuntime(options = {}) {
    if (typeof options !== 'object' || options === null)
        throw new TypeError('options must be an object');
    if (options.limits !== undefined && (typeof options.limits !== 'object' || options.limits === null)) {
        throw new TypeError('limits must be an object');
    }
    const timeout = option(options.timeout, 'timeout', 3000);
    const startupTimeout = option(options.startupTimeout, 'startupTimeout', 10000);
    const sourceChars = option(options.limits?.sourceChars, 'limits.sourceChars', 64000);
    const outputBytes = option(options.limits?.outputBytes, 'limits.outputBytes', 4 * 1024 * 1024);
    // JSON at most doubles the SVG (quotes escape to two bytes); the slack holds the envelope,
    // the notes and a failure message.
    const capacity = 2 * outputBytes + 262144;
    let worker;
    let state;
    let bytes;
    let disposed = false;
    const spawn = () => {
        // Each worker gets its own buffer: a terminated worker still finishing a layout must not be
        // able to write its late answer where its replacement's answer is expected.
        const buffer = new SharedArrayBuffer(HEADER + capacity);
        state = new Int32Array(buffer, 0, HEADER / 4);
        bytes = new Uint8Array(buffer, HEADER);
        worker = new Worker(new URL('./worker.js', import.meta.url), {
            workerData: { buffer },
            env: {},
            stdout: true,
            stderr: true,
            resourceLimits: { maxOldGenerationSizeMb: 256 }
        });
        // Emscripten reports an abort on stderr; the render learns of it through its reply.
        worker.stdout.resume();
        worker.stderr.resume();
        // A crash surfaces to the waiting render as a timeout; this only keeps it from being fatal.
        worker.on('error', () => { });
        worker.unref();
        return worker;
    };
    const stop = () => {
        void worker?.terminate();
        worker = undefined;
    };
    const payload = () => new TextDecoder().decode(bytes.slice(0, Atomics.load(state, LENGTH)));
    // Start the first worker now, so the first fence does not wait for ELK to load. Not fatal if
    // it fails: the next render starts a fresh one.
    spawn();
    await new Promise((resolve) => {
        const started = worker;
        const timer = setTimeout(done, startupTimeout);
        function done() {
            clearTimeout(timer);
            started.off('message', done);
            started.off('exit', done);
            resolve();
        }
        started.on('message', done);
        started.on('exit', done);
    });
    return {
        render(input) {
            if (disposed)
                throw new Error('render() called after dispose()');
            if (!isPrepared(input))
                throw new TypeError('render() takes what prepare() returned for the fence');
            const { source } = input;
            if (source.length > sourceChars) {
                return { status: 'failure', message: `SPICE source exceeds the ${sourceChars}-character limit` };
            }
            if (input.failure)
                return { status: 'failure', ...input.failure };
            if (!worker)
                spawn();
            // Starting is waited for separately, so the layout budget is the same for a fresh worker as
            // for a warm one.
            if (Atomics.load(state, ENGINE) === STARTING)
                Atomics.wait(state, ENGINE, STARTING, startupTimeout);
            const engine = Atomics.load(state, ENGINE);
            if (engine !== STARTED) {
                const why = engine === FAILED ? payload() : `the SPICE layout worker did not start within ${startupTimeout} ms`;
                stop();
                return { status: 'unavailable', reason: why };
            }
            Atomics.store(state, READY, 0);
            const request = {
                source,
                dialect: input.dialect,
                files: input.files.map((file) => ('text' in file ? { key: file.key, text: file.text } : { key: file.key, error: file.error })),
                outputBytes
            };
            worker.postMessage(request);
            if (Atomics.wait(state, READY, 0, timeout) === 'timed-out') {
                stop();
                return { status: 'timeout', budget: timeout };
            }
            const { discard, ...result } = JSON.parse(payload());
            if (discard)
                stop();
            return result;
        },
        async dispose() {
            disposed = true;
            const last = worker;
            worker = undefined;
            await last?.terminate();
        }
    };
}
