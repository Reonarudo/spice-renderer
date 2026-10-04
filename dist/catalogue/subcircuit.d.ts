import type { ElementType } from './types.js';
/**
 * `X n1 … nN name [params: …] [k=v …]`: the subcircuit name is the last positional token and the
 * nodes are everything before it, matched against the `.subckt` ports (PSpice's `OPTIONAL:` pins
 * may be omitted from the right). In Spectre any master the catalogue does not name — a `subckt`,
 * an `inline subckt`, a Verilog-A module — is an instance of this type.
 */
declare const element: ElementType;
export default element;
