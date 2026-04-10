/**
 * @fileoverview Ring 2 — Charter Compliance Gate
 *
 * Does this message comply with the guild's charter? Checks for explicit
 * charter violations: off-topic in focused channels, promotional content
 * where disallowed, recruitment spam, and messages that violate the
 * community's stated values.
 *
 * ISA-95 analogy: Is this work order authorized by the production schedule?
 *
 * @module rings/r2-charter
 */

/** Promotional / spam patterns */
const PROMO_PATTERNS = [
  /\b(check out my|subscribe to|follow me|link in bio)\b/i,
  /\b(join my server|free (nft|airdrop|token))\b/i,
  /\b(dm me for|send me a dm)\b.*\b(deal|offer|price)\b/i,
  /https?:\/\/\S+\.(ly|click|link)\//i,
];

/** Recruitment spam patterns */
const RECRUITMENT_PATTERNS = [
  /\b(we('re| are) hiring|looking for (devs|developers|engineers))\b/i,
  /\b(apply now|job (opening|opportunity))\b/i,
];

/**
 * Check whether a message complies with charter rules.
 *
 * @param {import('discord.js').Message} message - The Discord message
 * @returns {{ pass: boolean, note: string }} Ring result
 */
export function check(message) {
  const content = (message.content || '').trim();

  // Promotional content check
  for (const pattern of PROMO_PATTERNS) {
    if (pattern.test(content)) {
      return {
        pass: false,
        note: 'R2: Promotional content detected. This space is for craft, not marketing.',
      };
    }
  }

  // Recruitment spam
  for (const pattern of RECRUITMENT_PATTERNS) {
    if (pattern.test(content)) {
      return {
        pass: false,
        note: 'R2: Recruitment post detected. Use the designated channel or ask a mod.',
      };
    }
  }

  // Channel-topic compliance would require guild config — stub for now
  // TODO: Load per-channel topic rules from config/charter/

  return { pass: true, note: 'R2: Charter compliance check passed.' };
}
