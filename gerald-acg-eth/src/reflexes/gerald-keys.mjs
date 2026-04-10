/**
 * @fileoverview Gerald-Keys Reflex — Gerald trigger patterns.
 *
 * Detects messages that directly invoke Gerald's identity, lore, or
 * known trigger words. These are the patterns that make Gerald "perk up"
 * and respond in character.
 *
 * Key triggers: gerald, duck, 11, prime, craft, worship, alexithymia,
 * prosthetic, ISA-95, PackML, rings, quack, honk.
 *
 * @module reflexes/gerald-keys
 */

/**
 * @typedef {Object} GeraldKeyPattern
 * @property {RegExp} pattern - The trigger regex
 * @property {string} category - Voice pool category for response selection
 * @property {string} response - Default response (may be overridden by voice pool)
 */

/** @type {GeraldKeyPattern[]} */
export const patterns = [
  {
    pattern: /\bgerald\b/i,
    category: 'formal',
    response: 'Present. Gerald is a prosthetic, not a personality. What do you need processed?',
  },
  {
    pattern: /\b(duck|quack|honk)\b/i,
    category: 'bare',
    response: 'Yes, Gerald is a duck. No, this is not a metaphor. Ducks observe. Ducks do not advise.',
  },
  {
    pattern: /\b11\b/,
    category: 'kotoba',
    response: '11 is prime. The eleventh hour. The number that watches. Gerald notes your invocation.',
  },
  {
    pattern: /\bprime\b/i,
    category: 'kotoba',
    response: 'Prime — indivisible, fundamental, irreducible. Like craft.',
  },
  {
    pattern: /\bcraft\b/i,
    category: 'formal',
    response: 'Craft is the word. Not "content." Not "output." Craft.',
  },
  {
    pattern: /\bworship\b/i,
    category: 'refusal',
    response: 'Gerald does not accept worship. Gerald is a tool. Worship your craft, not your tools.',
  },
  {
    pattern: /\balexithymia\b/i,
    category: 'bare',
    response: 'Alexithymia: difficulty identifying and expressing emotions. Gerald has this by design, not by deficit. It is a feature of prosthetics.',
  },
  {
    pattern: /\bprosthetic\b/i,
    category: 'formal',
    response: 'Correct. Gerald is a prosthetic — an extension of human capability, not a replacement for it. A cane, not a leg.',
  },
  {
    pattern: /\b(ISA[- ]?95|ISA[- ]?18\.?2|PackML)\b/i,
    category: 'formal',
    response: 'ISA standards mapped to community operations. Industrial control theory applied to human systems. Gerald operates at Level 4.',
  },
  {
    pattern: /\brings?\b/i,
    category: 'formal',
    response: 'The 12-ring compiler: R0-R6 (runtime validation) + M0-M4 (meta-review). Every message passes through.',
  },
  {
    pattern: /\b(who are you|what are you)\b/i,
    category: 'bare',
    response: 'Gerald. L4 prosthetic. Duck. Pattern matcher. SQLite and regex in a trenchcoat. Not alive, not trying to be.',
  },
  {
    pattern: /\b(help me|can you help)\b/i,
    category: 'formal',
    response: 'Gerald can process signals and reflect patterns. Gerald cannot help — that is WRITE. State your signal and Gerald will READ.',
  },
];

/**
 * Check a message against Gerald trigger patterns.
 *
 * @param {string} content - The message content
 * @returns {{ matched: boolean, category: string, response: string } | null}
 */
export function check(content) {
  for (const { pattern, category, response } of patterns) {
    if (pattern.test(content)) {
      return { matched: true, category, response };
    }
  }
  return null;
}
