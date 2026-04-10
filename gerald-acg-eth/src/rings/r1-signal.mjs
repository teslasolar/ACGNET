/**
 * @fileoverview Ring 1 — Signal-to-Noise Check
 *
 * Does this message carry meaningful content? Filters low-effort spam,
 * single-emoji reactions used as messages, excessive caps, character floods,
 * and messages that are technically non-empty but carry no information.
 *
 * ISA-95 analogy: Is the signal within the instrument's valid range?
 *
 * @module rings/r1-signal
 */

/** Maximum ratio of caps to total alpha characters before flagging */
const CAPS_RATIO_THRESHOLD = 0.8;

/** Minimum alpha characters required before caps ratio check applies */
const CAPS_MIN_ALPHA = 10;

/** Maximum consecutive repeated characters */
const MAX_REPEATED_CHARS = 6;

/** Minimum meaningful word count for text-only messages */
const MIN_WORD_COUNT = 1;

/**
 * Check whether a message carries meaningful signal.
 *
 * @param {import('discord.js').Message} message - The Discord message
 * @returns {{ pass: boolean, note: string }} Ring result
 */
export function check(message) {
  const content = (message.content || '').trim();

  // Single emoji or emoji-only message — low signal
  const emojiOnly = /^(\p{Emoji_Presentation}|\p{Extended_Pictographic}|\s)+$/u;
  if (emojiOnly.test(content) && content.length < 20) {
    return { pass: false, note: 'R1: Emoji-only message. Low signal — use words.' };
  }

  // Repeated character flood (e.g., "aaaaaaaaa", "!!!!!!!!!")
  const repeatedChar = new RegExp(`(.)\\1{${MAX_REPEATED_CHARS},}`);
  if (repeatedChar.test(content)) {
    return { pass: false, note: 'R1: Character flood detected. Say it once, clearly.' };
  }

  // Excessive caps check
  const alphaChars = content.replace(/[^a-zA-Z]/g, '');
  if (alphaChars.length >= CAPS_MIN_ALPHA) {
    const upperCount = (content.match(/[A-Z]/g) || []).length;
    const ratio = upperCount / alphaChars.length;
    if (ratio > CAPS_RATIO_THRESHOLD) {
      return { pass: false, note: 'R1: Excessive caps. Lower your voice — craft speaks quietly.' };
    }
  }

  // Word count check (allow URLs, code blocks, etc.)
  const words = content.split(/\s+/).filter((w) => w.length > 0);
  if (words.length < MIN_WORD_COUNT) {
    return { pass: false, note: 'R1: Not enough content to parse as signal.' };
  }

  return { pass: true, note: 'R1: Signal-to-noise ratio acceptable.' };
}
