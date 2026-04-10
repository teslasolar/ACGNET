/**
 * @module r0-ground
 * @description Ring 0: Existence Check
 *
 * The ground ring verifies that a message exists in a meaningful sense:
 * - Not empty or whitespace-only
 * - Not bot-generated slop (repetitive, template-like, or LLM filler)
 * - Contains at least one parseable semantic unit
 *
 * This is the first gate. If R0 fails, nothing else runs.
 */

/** Minimum character count for a message to be considered "existing" */
const MIN_LENGTH = 2;

/** Maximum ratio of repeated characters before flagging as noise */
const REPEAT_RATIO_THRESHOLD = 0.7;

/** Common bot slop markers */
const SLOP_PATTERNS = [
  /^(ha){5,}$/i,
  /^\.{3,}$/,
  /^!{3,}$/,
  /^\?{3,}$/,
  /^(.)\1{9,}$/,                          // single char repeated 10+ times
  /^(sure|ok|yes|no|lol|lmao|bruh)\s*$/i, // zero-signal responses
];

/** LLM slop markers — phrases that indicate AI-generated filler */
const LLM_SLOP_PATTERNS = [
  /as an ai language model/i,
  /i'd be happy to help/i,
  /let me break this down/i,
  /great question/i,
  /absolutely[!.]\s*here/i,
  /in today's fast-paced world/i,
  /it's worth noting that/i,
  /dive deep into/i,
  /at the end of the day/i,
  /unlock the (full )?potential/i,
];

/**
 * Check whether a message passes the existence gate.
 * @param {import('discord.js').Message} message - The Discord message to check
 * @returns {{ pass: boolean, note: string }} Result with pass/fail and explanation
 */
export function check(message) {
  const content = message.content?.trim() ?? '';

  // Empty or too short
  if (content.length < MIN_LENGTH) {
    return { pass: false, note: 'R0: Message below existence threshold (empty or too short)' };
  }

  // Bot-authored messages
  if (message.author?.bot) {
    return { pass: false, note: 'R0: Bot-authored message — skipping' };
  }

  // Repetitive noise
  for (const pattern of SLOP_PATTERNS) {
    if (pattern.test(content)) {
      return { pass: false, note: 'R0: Repetitive noise pattern detected' };
    }
  }

  // Character repetition ratio
  const chars = content.replace(/\s/g, '');
  if (chars.length > 0) {
    const freq = {};
    for (const c of chars) {
      freq[c] = (freq[c] || 0) + 1;
    }
    const maxFreq = Math.max(...Object.values(freq));
    if (maxFreq / chars.length > REPEAT_RATIO_THRESHOLD) {
      return { pass: false, note: 'R0: Excessive character repetition' };
    }
  }

  // LLM slop detection
  for (const pattern of LLM_SLOP_PATTERNS) {
    if (pattern.test(content)) {
      return { pass: false, note: `R0: LLM slop detected — "${pattern.source}"` };
    }
  }

  return { pass: true, note: 'R0: Existence confirmed' };
}
