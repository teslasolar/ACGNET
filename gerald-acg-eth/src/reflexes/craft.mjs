/**
 * @fileoverview Craft Reflex — Detects and responds to craft-related patterns.
 *
 * Both positive (encouraging real craft) and negative (discouraging anti-craft).
 * Gerald rewards showing work, iteration, and honest assessment.
 * Gerald discourages shortcuts, copy-paste culture, and cargo-culting.
 *
 * @module reflexes/craft
 */

/**
 * @typedef {Object} CraftPattern
 * @property {RegExp} pattern - The regex to match
 * @property {'positive'|'negative'} valence - Whether this is craft or anti-craft
 * @property {string} response - Gerald's response
 */

/** @type {CraftPattern[]} */
export const positivePatterns = [
  {
    pattern: /\b(i (built|made|wrote|created|shipped|designed))\b/i,
    valence: 'positive',
    response: 'Craft acknowledged. Show us what you made.',
  },
  {
    pattern: /\b(here('s| is) (my|the) (code|implementation|solution|approach))\b/i,
    valence: 'positive',
    response: 'Showing work is the foundation of craft. Let the rings evaluate.',
  },
  {
    pattern: /\b(i (tried|attempted|experimented|iterated))\b/i,
    valence: 'positive',
    response: 'Iteration is craft. What did you learn from the attempt?',
  },
  {
    pattern: /\b(i was wrong|i made a mistake|my bad|i broke)\b/i,
    valence: 'positive',
    response: 'Honest error acknowledgment is a craft virtue. What did you learn?',
  },
  {
    pattern: /\b(code review|pr review|feedback (on|for))\b/i,
    valence: 'positive',
    response: 'Review is craft in dialogue form. Proceed.',
  },
  {
    pattern: /\b(pair(ed|ing)?( programming)?|mob(bed|bing)?( programming)?)\b/i,
    valence: 'positive',
    response: 'Collaborative craft. Good.',
  },
];

/** @type {CraftPattern[]} */
export const negativePatterns = [
  {
    pattern: /\b(just (copy|paste|use|grab) (it |this )?from (stack ?overflow|chatgpt|copilot))\b/i,
    valence: 'negative',
    response: 'Copy-paste is not craft. Understand what you\'re using before you ship it.',
  },
  {
    pattern: /\b(it works,? (don't|do not) (touch|change|question) it)\b/i,
    valence: 'negative',
    response: '"It works" is the lowest bar. Craft asks: is it maintainable, testable, readable?',
  },
  {
    pattern: /\b(good enough|ship it|move on|who cares)\b.*\b(quality|test|review|debt)\b/i,
    valence: 'negative',
    response: 'Technical debt is real debt. "Good enough" compounds interest.',
  },
  {
    pattern: /\b(that('s| is) (just )?(a |an )?(junior|beginner|newbie) (mistake|question|thing))\b/i,
    valence: 'negative',
    response: 'There are no junior questions. There are only questions. Answer with craft or say nothing.',
  },
  {
    pattern: /\b(real (programmers?|devs?|engineers?) (don't|never|wouldn't))\b/i,
    valence: 'negative',
    response: 'Gatekeeping is anti-craft. Real practitioners help others learn.',
  },
  {
    pattern: /\b(vibe[- ]?cod(e|ing))\b/i,
    valence: 'negative',
    response: 'Vibe coding is not coding. Understanding what your tools produce is the minimum bar of craft.',
  },
];

/**
 * Check a message against craft patterns.
 *
 * @param {string} content - The message content
 * @returns {{ matched: boolean, valence: string, response: string, category: string } | null}
 */
export function check(content) {
  // Check negative patterns first (they need correction)
  for (const { pattern, valence, response } of negativePatterns) {
    if (pattern.test(content)) {
      return { matched: true, valence, response, category: 'slop-call' };
    }
  }

  // Then positive patterns (acknowledgment)
  for (const { pattern, valence, response } of positivePatterns) {
    if (pattern.test(content)) {
      return { matched: true, valence, response, category: 'formal' };
    }
  }

  return null;
}
