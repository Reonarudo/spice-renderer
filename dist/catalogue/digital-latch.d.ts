import type { ElementType } from './types.js';
/**
 * Gated latches: PSpice `SRFF(g)` s×g r×g q×g qbar×g and `DLTCH(g)` d×g q×g qbar×g sharing preset,
 * clear and gate (RG p.374); Xyce's single `DLTCH` with enable (RG §2.3.28).
 */
declare const element: ElementType;
export default element;
