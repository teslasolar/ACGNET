/**
 * @fileoverview Meta-Ring 0 — Aether / Hypothesis Review (RFC)
 *
 * The first meta-ring. Reviews messages that propose new ideas, hypotheses,
 * or Request-for-Comment (RFC) items. Ensures proposals are structured,
 * falsifiable, and grounded in observable craft.
 *
 * Only triggers on messages that contain proposal markers (RFC, proposal,
 * hypothesis, "what if", etc.).
 *
 * ISA-95 analogy: Engineering change request — is the proposal well-formed?
 *
 * @module rings/m0-aether
 */

/** Patterns that indicate this message is a proposal/hypothesis */
const PROPOSAL_MARKERS = [
  /\b(rfc|request for comment|proposal)\b/i,
  /\b(hypothesis|what if|suppose|imagine if)\b/i,
  /\b(i propose|i suggest|consider this)\b/i,
  /\b(new idea|thought experiment|brainstorm)\b/i,
];

/** Required structural elements for a well-formed proposal */
const STRUCTURE_MARKERS = {
  problem: /\b(problem|issue|challenge|pain point|gap)\b/i,
  solution: /\b(solution|approach|method|proposal|plan|idea)\b/i,
  evidence: /\b(because|evidence|data|shows?|proves?|demonstrated?)\b/i,
  falsifiable: /\b(if not|unless|could be wrong|disproven?|counterexample)\b/i,
};

/**
 * Check whether a proposal/hypothesis message is well-formed.
 *
 * @param {import('discord.js').Message} message - The Discord message
 * @returns {{ pass: boolean, note: string }} Ring result
 */
export function check(message) {
  const content = (message.content || '').trim();

  // Only trigger on proposal-like messages
  const isProposal = PROPOSAL_MARKERS.some((p) => p.test(content));
  if (!isProposal) {
    return { pass: true, note: 'M0: Not a proposal — ring skipped.' };
  }

  // Check structural completeness
  const missing = [];
  for (const [element, pattern] of Object.entries(STRUCTURE_MARKERS)) {
    if (!pattern.test(content)) {
      missing.push(element);
    }
  }

  if (missing.length > 2) {
    return {
      pass: false,
      note: `M0: Proposal lacks structure. Missing: ${missing.join(', ')}. RFCs need a problem, solution, evidence, and falsifiability.`,
    };
  }

  if (missing.length > 0) {
    return {
      pass: true,
      note: `M0: Proposal noted. Consider adding: ${missing.join(', ')}.`,
    };
  }

  return { pass: true, note: 'M0: Well-formed proposal — hypothesis review passed.' };
}
