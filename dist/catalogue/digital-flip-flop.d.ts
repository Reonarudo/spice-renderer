import type { ElementType } from './types.js';
/**
 * Edge-triggered flip-flops. PSpice's take `(g)` flip-flops sharing preset, clear and clock:
 * `DFF(g)` d×g q×g qbar×g, `JKFF(g)` j×g k×g q×g qbar×g, and `DFFDE`/`JKFFDE` with positive- and
 * negative-edge enables (RG p.368). Xyce's `DFF`, `JKFF` and `TFF` are single (RG §2.3.28).
 */
declare const element: ElementType;
export default element;
