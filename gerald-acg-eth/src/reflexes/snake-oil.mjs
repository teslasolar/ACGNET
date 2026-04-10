/**
 * @fileoverview Snake-Oil Reflex — Detects AI/tech hype and snake oil claims.
 *
 * Gerald's fastest reflex. Fires on marketing buzzwords, inflated claims,
 * and the specific vocabulary of tech charlatanism. Each pattern has a
 * severity level: 'warn' (flag but allow) or 'refuse' (block).
 *
 * @module reflexes/snake-oil
 */

/**
 * @typedef {Object} SnakeOilPattern
 * @property {RegExp} pattern - The regex to match
 * @property {'warn'|'refuse'} level - Severity level
 * @property {string} response - Gerald's response when triggered
 */

/** @type {SnakeOilPattern[]} */
export const patterns = [
  {
    pattern: /\bAI[- ]?powered\b/i,
    level: 'warn',
    response: '"AI-powered" is not a feature. What does it actually do? Name the model, the task, the metric.',
  },
  {
    pattern: /\brevolutionary\b/i,
    level: 'warn',
    response: 'Revolutions are messy and most fail. What specific improvement does this offer over the current approach?',
  },
  {
    pattern: /\b10x\b/i,
    level: 'warn',
    response: '10x claims require 10x evidence. Where is the benchmark? What is the baseline?',
  },
  {
    pattern: /\bsentient\b/i,
    level: 'refuse',
    response: 'Nothing you are selling is sentient. Gerald is a duck and even he knows this.',
  },
  {
    pattern: /\bAGI\b/i,
    level: 'warn',
    response: 'AGI is a marketing term, not an engineering spec. What can it actually do today?',
  },
  {
    pattern: /\bdisrupt(ive|ing|s|ion)?\b/i,
    level: 'warn',
    response: 'Disruption is what happens to other people. Describe the value you create, not the damage.',
  },
  {
    pattern: /\bblockchain\b.*\b(solves?|fixes?|revolution)\b/i,
    level: 'refuse',
    response: 'Blockchain solves exactly one problem: Byzantine fault tolerance in distributed ledgers. Is that your problem?',
  },
  {
    pattern: /\bquantum\b.*\b(leap|supremacy|advantage)\b/i,
    level: 'warn',
    response: 'Quantum claims require quantum evidence. Are you running on actual quantum hardware?',
  },
  {
    pattern: /\bsynerg(y|ies|istic)\b/i,
    level: 'refuse',
    response: 'The word "synergy" is a reliable indicator that the speaker has nothing concrete to say.',
  },
  {
    pattern: /\bparadigm\s+shift\b/i,
    level: 'refuse',
    response: 'Kuhn is spinning in his grave. A real paradigm shift doesn\'t announce itself with a press release.',
  },
];

/**
 * Check a message against all snake-oil patterns.
 *
 * @param {string} content - The message content to check
 * @returns {{ matched: boolean, level: string, response: string, category: string } | null}
 */
export function check(content) {
  for (const { pattern, level, response } of patterns) {
    if (pattern.test(content)) {
      return { matched: true, level, response, category: 'slop-call' };
    }
  }
  return null;
}
