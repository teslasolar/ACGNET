/**
 * @fileoverview Ring 3 — Psych Safety / Tone Check
 *
 * Is this message psychologically safe for the community? Detects hostile
 * tone, personal attacks, pile-on dynamics, and messages that could cause
 * harm to vulnerable members. Gerald operates READ-only here — he observes
 * and flags, never commands.
 *
 * ISA-95 analogy: Safety interlock — is the equipment in a safe operating state?
 *
 * @module rings/r3-psych
 */

/** Direct hostility patterns */
const HOSTILITY_PATTERNS = [
  /\byou('re| are) (an? )?(idiot|moron|stupid|trash|garbage|worthless)\b/i,
  /\b(shut (the fuck )?up|stfu|kys|kill yourself)\b/i,
  /\b(nobody (asked|cares)|go away|get lost)\b/i,
  /\b(you suck|you('re| are) terrible)\b/i,
];

/** Pile-on / dogpile indicators */
const PILEON_PATTERNS = [
  /\b(ratio|L\b|cope|seethe|mald|stay mad)\b/i,
  /\b(common .+ (L|loss))\b/i,
];

/** Self-harm / crisis indicators — these route to P4 (crisis) */
const CRISIS_PATTERNS = [
  /\b(i want to die|end it all|no reason to live)\b/i,
  /\b(suicide|self[- ]harm|hurt myself)\b/i,
  /\b(can't go on|giving up|final (goodbye|message))\b/i,
];

/**
 * Check whether a message meets psych safety standards.
 *
 * @param {import('discord.js').Message} message - The Discord message
 * @returns {{ pass: boolean, note: string, escalate?: boolean, route?: string }} Ring result
 */
export function check(message) {
  const content = (message.content || '').trim();

  // Crisis detection — immediate escalation, do NOT block the message
  for (const pattern of CRISIS_PATTERNS) {
    if (pattern.test(content)) {
      return {
        pass: true, // Do NOT silence someone in crisis
        note: 'R3: Crisis signal detected — routing to P4 (crisis pathway).',
        escalate: true,
        route: 'P4',
      };
    }
  }

  // Direct hostility
  for (const pattern of HOSTILITY_PATTERNS) {
    if (pattern.test(content)) {
      return {
        pass: false,
        note: 'R3: Hostile tone detected. Craft communities require respect. Rephrase.',
      };
    }
  }

  // Pile-on dynamics
  for (const pattern of PILEON_PATTERNS) {
    if (pattern.test(content)) {
      return {
        pass: false,
        note: 'R3: Pile-on language detected. Engage with the idea, not the person.',
      };
    }
  }

  return { pass: true, note: 'R3: Psych safety check passed — tone acceptable.' };
}
