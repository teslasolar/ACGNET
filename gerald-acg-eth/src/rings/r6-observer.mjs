/**
 * @fileoverview Ring 6 — ACG Watermark / Meta Check
 *
 * The observer ring. Checks for meta-level ACG compliance: is this message
 * consistent with the Anti-Cartel Gradient principles? Detects cartel
 * formation patterns, gatekeeping, credential-hoarding, and attempts to
 * centralize authority.
 *
 * ISA-95 analogy: Regulatory compliance — does this operation meet external standards?
 *
 * @module rings/r6-observer
 */

/** Cartel formation patterns — centralizing authority or gatekeeping */
const CARTEL_PATTERNS = [
  /\b(you need (my |our )?permission)\b/i,
  /\b(only (I|we) can (decide|approve|authorize))\b/i,
  /\b(you('re| are) not (qualified|allowed|permitted))\b/i,
  /\b(this is (my|our) (territory|domain|space))\b/i,
  /\b(you have to go through (me|us))\b/i,
];

/** Credential hoarding — using credentials as weapons */
const CREDENTIAL_HOARDING = [
  /\b(my (degree|certification|credential)s? (mean|prove|show))\b/i,
  /\b(without a (degree|cert|certification) you can't)\b/i,
  /\b(i('ve| have) been doing this (longer|more) than)\b/i,
];

/** Hierarchy enforcement — attempting to pull rank inappropriately */
const HIERARCHY_ENFORCEMENT = [
  /\b(know your place|stay in your lane)\b/i,
  /\b(that's above your (pay ?grade|level|rank))\b/i,
  /\b(you('re| are) just (a|an) (apprentice|beginner|newbie|junior))\b/i,
];

/**
 * Check whether a message passes the ACG meta-compliance ring.
 *
 * @param {import('discord.js').Message} message - The Discord message
 * @returns {{ pass: boolean, note: string }} Ring result
 */
export function check(message) {
  const content = (message.content || '').trim();

  // Cartel formation
  for (const pattern of CARTEL_PATTERNS) {
    if (pattern.test(content)) {
      return {
        pass: false,
        note: 'R6: Cartel pattern detected. ACG prohibits centralizing authority. Craft is open.',
      };
    }
  }

  // Credential hoarding
  for (const pattern of CREDENTIAL_HOARDING) {
    if (pattern.test(content)) {
      return {
        pass: false,
        note: 'R6: Credential gatekeeping detected. Show craft, don\'t wave papers.',
      };
    }
  }

  // Hierarchy enforcement
  for (const pattern of HIERARCHY_ENFORCEMENT) {
    if (pattern.test(content)) {
      return {
        pass: false,
        note: 'R6: Inappropriate rank-pulling detected. Respect is earned through craft, not title.',
      };
    }
  }

  return { pass: true, note: 'R6: ACG watermark check passed — no cartel patterns.' };
}
