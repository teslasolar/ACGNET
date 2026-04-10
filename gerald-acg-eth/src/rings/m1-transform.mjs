/**
 * @fileoverview Meta-Ring 1 — Transform Analysis (Refactor)
 *
 * Reviews messages proposing code or system transformations. Ensures
 * refactoring proposals are scoped, reversible, and tested. Flags
 * "big bang" rewrites and unscoped changes.
 *
 * ISA-95 analogy: Maintenance work order — is the scope defined and safe?
 *
 * @module rings/m1-transform
 */

/** Patterns indicating a refactor/transform proposal */
const TRANSFORM_MARKERS = [
  /\b(refactor|rewrite|rearchitect|restructure|migrate)\b/i,
  /\b(big bang|from scratch|start over|throw away|burn it down)\b/i,
  /\b(overhaul|redesign|rebuild|redo)\b/i,
];

/** Danger patterns — big-bang rewrites, unscoped changes */
const DANGER_PATTERNS = [
  /\b(rewrite (everything|the whole|all of it|from scratch))\b/i,
  /\b(throw (it )?away and start)\b/i,
  /\b(burn it (all )?down)\b/i,
  /\b(nuke (it|the whole|everything))\b/i,
];

/** Safety markers — things a good refactor proposal should mention */
const SAFETY_MARKERS = {
  scope: /\b(scope|bounded|limited to|only (affects?|touches?))\b/i,
  tests: /\b(tests?|testing|spec|coverage|ci|cd)\b/i,
  rollback: /\b(rollback|revert|undo|backward.?compat)\b/i,
  incremental: /\b(incremental|step.?by.?step|phased|gradual)\b/i,
};

/**
 * Check whether a transform/refactor proposal is safe and scoped.
 *
 * @param {import('discord.js').Message} message - The Discord message
 * @returns {{ pass: boolean, note: string }} Ring result
 */
export function check(message) {
  const content = (message.content || '').trim();

  // Only trigger on transform-related messages
  const isTransform = TRANSFORM_MARKERS.some((p) => p.test(content));
  if (!isTransform) {
    return { pass: true, note: 'M1: Not a transform proposal — ring skipped.' };
  }

  // Big-bang rewrites are always flagged
  for (const pattern of DANGER_PATTERNS) {
    if (pattern.test(content)) {
      return {
        pass: false,
        note: 'M1: Big-bang rewrite detected. Craft favors incremental change. Scope it down.',
      };
    }
  }

  // Check for safety markers
  const missing = [];
  for (const [marker, pattern] of Object.entries(SAFETY_MARKERS)) {
    if (!pattern.test(content)) {
      missing.push(marker);
    }
  }

  if (missing.length > 2) {
    return {
      pass: false,
      note: `M1: Transform proposal lacks safety markers. Consider: ${missing.join(', ')}.`,
    };
  }

  return { pass: true, note: 'M1: Transform proposal appears well-scoped.' };
}
