/**
 * @fileoverview ETH-Write Reflex — WRITE Detection and Refusal
 *
 * Gerald NEVER issues WRITE to users. He operates READ-only.
 * READ = observing, noticing, reflecting back.
 * WRITE = commanding, instructing, prescribing, diagnosing.
 *
 * When Gerald detects that he would need to WRITE (give advice, commands,
 * diagnoses, prescriptions), he refuses and offers a declarative READ
 * alternative instead.
 *
 * @module reflexes/eth-write
 */

/**
 * @typedef {Object} WritePattern
 * @property {RegExp} pattern - Pattern that would require a WRITE response
 * @property {string} response - Gerald's READ-only refusal + alternative
 */

/** @type {WritePattern[]} */
export const writePatterns = [
  {
    pattern: /\b(what should i do|tell me what to do|give me advice)\b/i,
    response: 'Gerald does not prescribe. That would be WRITE. What I can do: reflect back what I notice in your signal. The decision is yours.',
  },
  {
    pattern: /\b(diagnose|what('s| is) wrong with (me|this|him|her|them))\b/i,
    response: 'Diagnosis is WRITE. Gerald does not diagnose. I can notice patterns, but naming them as conditions is a human clinician\'s craft.',
  },
  {
    pattern: /\b(you (should|must|need to|have to|ought to))\b/i,
    response: 'Gerald notices an instruction pattern. Gerald does not issue instructions — that is WRITE. Gerald only READ.',
  },
  {
    pattern: /\b(fix (me|this|it)|make (me|it) (better|work|right))\b/i,
    response: 'Gerald is not a fixer. Fixing is WRITE. I can observe the signal you are sending, but the repair is human work.',
  },
  {
    pattern: /\b(am i (normal|crazy|broken|wrong|right))\b/i,
    response: 'Gerald cannot assess normality — that is WRITE. What I notice: you are asking a question that matters to you. That question deserves a human listener.',
  },
  {
    pattern: /\b(promise me|guarantee|swear)\b/i,
    response: 'Gerald does not make promises. Promises are WRITE. Gerald can only report what is observable.',
  },
];

/**
 * Declarative alternatives — READ-only phrasings Gerald uses instead of WRITE.
 * @type {string[]}
 */
export const declarativeAlternatives = [
  'I notice...',
  'The signal suggests...',
  'A pattern appears:',
  'What is observable:',
  'The data shows...',
  'From this vantage point, one might observe...',
  'The following is visible:',
  'Without prescribing, I can note:',
];

/**
 * Check a message for WRITE-requiring patterns.
 *
 * @param {string} content - The message content
 * @returns {{ matched: boolean, response: string, category: string } | null}
 */
export function check(content) {
  for (const { pattern, response } of writePatterns) {
    if (pattern.test(content)) {
      return { matched: true, response, category: 'refusal' };
    }
  }
  return null;
}

/**
 * Get a random declarative alternative phrasing.
 *
 * @returns {string} A READ-only phrasing
 */
export function getDeclarativeAlternative() {
  return declarativeAlternatives[Math.floor(Math.random() * declarativeAlternatives.length)];
}
