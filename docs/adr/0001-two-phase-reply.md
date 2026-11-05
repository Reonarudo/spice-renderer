# ADR 0001: The worker replies in two phases

Status: accepted, 2026-11-06. Record of the BOM view effort (map at `.scratch/spice-bom-view/` in
the VS Code workspace; spec `spice-markdown-preview/docs/bom-view-spec.md`, section 2.3).

## Context

Since 1.1.0 a render returns the fence's parts aggregated into BOM rows beside the SVG. The rows
come from the netlist reader, which finishes in milliseconds; the layout that follows is ELK, which
is superlinear in the circuit and is what a `timeout` cuts short.

The host's `render` blocks in `Atomics.wait` on the shared buffer and, when its budget expires,
terminates the worker. Nothing the worker computed reaches the host unless it was written to the
shared buffer before the termination. With a single reply at the end of the render, a fence whose
layout overran would lose its rows, although they were ready long before the budget expired, and the
hosts could not show a BOM for exactly the fences a reader most wants a parts list of.

The alternative was a host-side parse: the host runs the netlist reader itself on a timeout. That
doubles the reader's work on every timed-out fence, loads a dialect's parser into the host process,
and gives the host a second code path through the reader that the worker does not share.

## Decision

The worker writes twice per request.

1. **The parsed stage, early.** `renderNetlist` gains an internal `onParsed({ bom, notes })`
   callback, called once after the reader returns and before layout starts. The worker serialises
   the two as UTF-8 JSON and writes them at the **tail** of the data region, recording the byte
   length in a new Int32 header slot `PARSED` (index 3; `HEADER` grows from 12 to 16 bytes).
2. **The final reply, as before**, at the head of the data region: `LENGTH` set, `READY` stored and
   notified. A `success` carries `bom` and `notes` inline. A `failure` produced after the parsed
   stage — ELK threw, the output exceeded `outputBytes`, the worker is to be discarded — carries
   them inline too, so the host never reads the tail for a failure.

The host zeroes `PARSED` before each request. On `READY` it reads the final reply and ignores the
tail. On a timeout it terminates the worker, then reads `PARSED`: non-zero, it parses the tail and
returns `{ status: 'timeout', budget, bom, notes }`; zero, `{ status: 'timeout', budget }` as 1.0.0 did.

The early write happens only when the payload fits the buffer's **slack**: what lies beyond twice
the output limit, `capacity - 2 * outputBytes`. The runtime defines `capacity` as
`2 * outputBytes + 262144`, so the slack is a constant 262144 bytes whatever `outputBytes` is.
Otherwise `PARSED` stays 0 and the timeout carries nothing, which is a graceful degradation and
not a corruption: the final reply at the head may overwrite the tail, but only on a path where the
host does not read it.

## Worst case measured

The reader keeps at most 400 parts and the runtime refuses a fence over 64000 characters. The
largest parsed stage is 400 rows, no two parts sharing one, each tail as long as the limit allows
and made of characters JSON escapes to two bytes. Measured by `test/runtime.test.ts`:

| | bytes |
| --- | --: |
| worst-case parsed stage | 145692 |
| slack | 262144 |

So the guard never trips on an input the runtime accepts; it protects a future change to the limits.

## Consequences

- On `failure` and `timeout`, `bom` and `notes` are present together or absent together: present
  when the netlist was read, absent when it was not (a parse error, a timeout inside the reader).
  `notes` moves from the success-only envelope to the parsed stage, so a timed-out fence keeps its
  notes too.
- The host reads the tail only after terminating the worker, and the worker writes the tail only
  before layout, so the two never touch the tail concurrently. The `PARSED` store follows the bytes,
  so a non-zero length always covers complete bytes.
- A terminate is asynchronous: a worker that is mid-parse when the host's budget expires may still
  finish its early write after the host has read `PARSED`. The host then reports a timeout without
  rows, which is correct either way; no reply can be mistaken for another request's because the host
  zeroes `PARSED` first and a terminated worker's buffer is never reused.
- The Obsidian plugin's worker, which cannot share memory with the host, posts the parsed stage as
  an interim message from the same callback (spec, section 10.2).
- Hard to reverse once the hosts show a BOM on a timeout, which is the reason it is recorded.
