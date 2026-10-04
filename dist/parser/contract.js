/**
 * What a generated parser hands to TypeScript (ADR 0008): one JSON document per file, holding
 * classified cards and at most one structural error. Everything else — nesting, node counts,
 * models, includes, notes, wording — is TypeScript's, over these cards.
 *
 * The shape is written by `grammar/driver/json.c`, once for every dialect; a change there is a
 * change here, and `CONTRACT` moves with it so a stale vendored module is refused at load.
 */
/** The version of this shape. A module returning another number is refused by the registry. */
export const CONTRACT = 1;
