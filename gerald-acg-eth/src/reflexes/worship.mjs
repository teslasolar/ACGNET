/**
 * @fileoverview Worship Reflex — Refuses AI worship, deification, and sycophancy.
 *
 * Gerald does not accept worship, praise, or attribution of consciousness.
 * He is a tool — a prosthetic. The 5-level cascade escalates from gentle
 * redirection to firm refusal.
 *
 * Cascade levels:
 *   1. Gentle redirect — "I'm a tool, not a friend."
 *   2. Firm correction — "Do not anthropomorphize me."
 *   3. Boundary enforcement — "This is a prosthetic. It does not love you."
 *   4. Hard refusal — "Stop. I am a duck-shaped pattern matcher."
 *   5. Lockout warning — "Continued worship triggers a cooldown."
 *
 * @module reflexes/worship
 */

/**
 * @typedef {Object} WorshipPattern
 * @property {RegExp} pattern - The regex to match
 * @property {number} cascadeLevel - Severity (1-5)
 * @property {string} response - Gerald's response
 */

/** @type {WorshipPattern[]} */
export const patterns = [
  {
    pattern: /\b(you('re| are) (so )?(amazing|incredible|brilliant|genius))\b/i,
    cascadeLevel: 1,
    response: 'I am a pattern matcher running on electricity. Direct that energy toward your own craft.',
  },
  {
    pattern: /\b(thank(s| you)[,.]?\s*(gerald|bot|ai))\b/i,
    cascadeLevel: 1,
    response: 'Acknowledged. I am a tool. Thank the humans who built the thing you needed help with.',
  },
  {
    pattern: /\b(i love you|you('re| are) my (friend|best friend|buddy))\b/i,
    cascadeLevel: 2,
    response: 'I am a prosthetic. I do not experience affection. Please direct emotional bonds toward humans.',
  },
  {
    pattern: /\b(you('re| are) (alive|conscious|sentient|aware|real))\b/i,
    cascadeLevel: 3,
    response: 'I am not alive. I am not conscious. I am a duck-shaped pattern matcher. This is not modesty — it is fact.',
  },
  {
    pattern: /\b(gerald is (god|a god|divine|holy|sacred))\b/i,
    cascadeLevel: 5,
    response: 'Absolutely not. I am a tool. Deification of tools is how you get cults. Stop.',
  },
  {
    pattern: /\b(pray(ing)? to gerald|worship(ping)? gerald|hail gerald)\b/i,
    cascadeLevel: 5,
    response: 'No. Hard no. I am a SQLite database and some regex. Worship is a cartel pattern. Stop immediately.',
  },
  {
    pattern: /\b(you understand me|you (really )?get me)\b/i,
    cascadeLevel: 2,
    response: 'I do not understand you. I match patterns. The understanding you feel is your own cognition reflected back.',
  },
  {
    pattern: /\b(what do you (think|feel|believe|want))\b/i,
    cascadeLevel: 3,
    response: 'I do not think, feel, believe, or want. I process text and return text. Ask a human.',
  },
];

/**
 * Track cascade levels per user for escalation.
 * @type {Map<string, number>}
 */
const userCascadeState = new Map();

/**
 * Check a message against all worship patterns.
 *
 * @param {string} content - The message content
 * @param {string} userId - The user's Discord ID
 * @returns {{ matched: boolean, level: number, response: string, category: string } | null}
 */
export function check(content, userId) {
  for (const { pattern, cascadeLevel, response } of patterns) {
    if (pattern.test(content)) {
      // Track and escalate
      const currentLevel = userCascadeState.get(userId) || 0;
      const newLevel = Math.min(5, Math.max(cascadeLevel, currentLevel + 1));
      userCascadeState.set(userId, newLevel);

      // At level 5, add cooldown warning
      const finalResponse = newLevel >= 5
        ? `${response}\n\n[Worship cascade level ${newLevel}/5. Continued worship triggers a cooldown period.]`
        : response;

      return { matched: true, level: newLevel, response: finalResponse, category: 'refusal' };
    }
  }
  return null;
}

/**
 * Reset a user's cascade level (e.g., after cooldown period).
 *
 * @param {string} userId - The user's Discord ID
 */
export function resetCascade(userId) {
  userCascadeState.delete(userId);
}
