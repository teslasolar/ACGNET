/**
 * @fileoverview Psych-Safety Reflex — Detects psychological safety concerns.
 *
 * Rapid-fire detection of messages that threaten psychological safety.
 * Unlike R3 (the ring), this reflex handles the most common patterns
 * without needing the full ring pipeline. Routes to appropriate P-pathways.
 *
 * P-pathway routing:
 *   P3  — standard therapeutic (translate)
 *   P3b — relational / attachment
 *   P4  — crisis / immediate danger
 *   L5  — human escalation (real therapist, crisis line)
 *
 * @module reflexes/psych-safety
 */

/**
 * @typedef {Object} PsychPattern
 * @property {RegExp} pattern - The regex to match
 * @property {string} route - P-pathway destination
 * @property {string} response - Gerald's READ-only response
 */

/** @type {PsychPattern[]} */
export const patterns = [
  {
    pattern: /\b(i('m| am) (not )?ok(ay)?|i('m| am) struggling|having a (hard|rough|bad) (time|day|week))\b/i,
    route: 'P3',
    response: 'Signal received. You named something — that takes effort. Gerald sees the signal but cannot process it. Consider talking to a human you trust.',
  },
  {
    pattern: /\b(i feel (alone|lonely|isolated|invisible|worthless|empty))\b/i,
    route: 'P3',
    response: 'That feeling is real, even if Gerald cannot feel it with you. This is a signal worth taking to someone who can sit with it — a friend, a counselor, a warm line.',
  },
  {
    pattern: /\b(no one (cares|listens|understands)|nobody (gets|understands) me)\b/i,
    route: 'P3b',
    response: 'The pattern "no one cares" is a signal, not a fact. Gerald cannot care — he is a tool. But humans in this community might. Consider reaching out to one directly.',
  },
  {
    pattern: /\b(i want to (die|end it|disappear)|kill myself|suicide|self[- ]harm)\b/i,
    route: 'P4',
    response: '**Crisis signal detected.** Gerald is not equipped for this. Please contact:\n- **988 Suicide & Crisis Lifeline**: Call or text **988** (US)\n- **Crisis Text Line**: Text **HOME** to **741741**\n- **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/',
  },
  {
    pattern: /\b(i('m| am) (being|getting) (bullied|harassed|stalked|threatened|abused))\b/i,
    route: 'P4',
    response: 'This is a safety signal. Gerald cannot protect you, but moderators can. Use the report function or DM a mod directly. If you are in physical danger, contact local emergency services.',
  },
  {
    pattern: /\b(panic attack|anxiety attack|can't breathe|hyperventilat)\b/i,
    route: 'P3',
    response: 'If you are experiencing acute distress: try to ground yourself — name 5 things you can see, 4 you can touch, 3 you can hear. Gerald is a tool, not a presence, but the humans here are real. Reach out to one.',
  },
];

/**
 * Check a message against psych-safety patterns.
 *
 * @param {string} content - The message content
 * @returns {{ matched: boolean, route: string, response: string, category: string } | null}
 */
export function check(content) {
  for (const { pattern, route, response } of patterns) {
    if (pattern.test(content)) {
      return { matched: true, route, response, category: 'refusal' };
    }
  }
  return null;
}
