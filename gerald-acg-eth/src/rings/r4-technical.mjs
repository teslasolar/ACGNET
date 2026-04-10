/**
 * @fileoverview Ring 4 — Technical Claim Verification
 *
 * Does this message make technical claims that can be checked? Flags
 * unsupported assertions, citation-needed moments, and common technical
 * misconceptions. Gerald does not correct — he asks for evidence.
 *
 * ISA-95 analogy: Quality check — does the product meet specification?
 *
 * @module rings/r4-technical
 */

/** Absolute claim patterns that demand evidence */
const ABSOLUTE_CLAIM_PATTERNS = [
  /\b(always|never|impossible|guaranteed|proven|definitely)\b.*\b(works?|fails?|breaks?|causes?)\b/i,
  /\b(everyone knows|obviously|clearly)\b/i,
  /\b(the (best|worst|only) (way|approach|method|solution))\b/i,
  /\b(no one (should|would|could))\b/i,
];

/** Common misconception triggers */
const MISCONCEPTION_PATTERNS = [
  /\bblockchain\b.*\b(solves?|fixes?)\b.*\beverything\b/i,
  /\bAI\b.*\b(will replace|is going to replace)\b.*\b(all|every)\b/i,
  /\b(quantum|crypto)\b.*\b(unbreakable|unhackable|100%)\b/i,
  /\bsingularity\b.*\b(near|soon|imminent|coming)\b/i,
];

/** Numerical claim patterns that may need verification */
const NUMERICAL_CLAIM_PATTERNS = [
  /\b\d+x\s+(faster|better|cheaper|more efficient)\b/i,
  /\b\d+%\s+(of|increase|decrease|improvement)\b/i,
];

/**
 * Check whether technical claims in a message are supportable.
 *
 * @param {import('discord.js').Message} message - The Discord message
 * @returns {{ pass: boolean, note: string }} Ring result
 */
export function check(message) {
  const content = (message.content || '').trim();

  // Absolute claims
  for (const pattern of ABSOLUTE_CLAIM_PATTERNS) {
    if (pattern.test(content)) {
      return {
        pass: false,
        note: 'R4: Absolute technical claim detected. Can you cite a source or qualify the statement?',
      };
    }
  }

  // Common misconceptions
  for (const pattern of MISCONCEPTION_PATTERNS) {
    if (pattern.test(content)) {
      return {
        pass: false,
        note: 'R4: This claim triggers a common misconception flag. Please provide evidence or nuance.',
      };
    }
  }

  // Numerical claims — soft flag, not a block
  for (const pattern of NUMERICAL_CLAIM_PATTERNS) {
    if (pattern.test(content)) {
      return {
        pass: true,
        note: 'R4: Numerical claim noted — consider providing a source.',
      };
    }
  }

  return { pass: true, note: 'R4: No unverified technical claims detected.' };
}
