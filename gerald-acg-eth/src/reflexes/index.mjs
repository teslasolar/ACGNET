/**
 * @fileoverview Reflex Engine — Pattern-matched response system.
 *
 * Reflexes are Gerald's fastest response path. They fire on regex matches
 * without any LLM involvement. 95%+ of all traffic is handled here.
 *
 * Reflex order matters — earlier reflexes take priority:
 *   1. snake-oil   — Hype and charlatan detection
 *   2. worship     — AI deification refusal
 *   3. craft       — Craft pattern recognition
 *   4. psych-safety — Psychological safety signals
 *   5. eth-write   — WRITE detection and refusal
 *   6. gerald-keys — Gerald identity triggers
 *
 * @module reflexes
 */

import { check as checkSnakeOil } from './snake-oil.mjs';
import { check as checkWorship } from './worship.mjs';
import { check as checkCraft } from './craft.mjs';
import { check as checkPsychSafety } from './psych-safety.mjs';
import { check as checkEthWrite } from './eth-write.mjs';
import { check as checkGeraldKeys } from './gerald-keys.mjs';

/**
 * @typedef {Object} ReflexResult
 * @property {string} reflex - Name of the reflex that matched
 * @property {string} response - The response text
 * @property {string} category - Voice pool category
 * @property {string} [route] - P-pathway route (psych-safety only)
 * @property {string} [level] - Severity level
 */

/**
 * Process a Discord message through all reflex modules in priority order.
 * Returns the first match, or null if no reflexes fire.
 *
 * @param {import('discord.js').Message} message - The Discord message
 * @returns {ReflexResult | null} The first matching reflex result, or null
 */
export function processReflexes(message) {
  const content = (message.content || '').trim();
  if (!content) return null;

  const userId = message.author?.id || 'unknown';

  // 1. Snake-oil detection
  const snakeOil = checkSnakeOil(content);
  if (snakeOil) {
    return {
      reflex: 'snake-oil',
      response: snakeOil.response,
      category: snakeOil.category,
      level: snakeOil.level,
    };
  }

  // 2. Worship refusal
  const worship = checkWorship(content, userId);
  if (worship) {
    return {
      reflex: 'worship',
      response: worship.response,
      category: worship.category,
      level: String(worship.level),
    };
  }

  // 3. Craft patterns
  const craft = checkCraft(content);
  if (craft) {
    return {
      reflex: 'craft',
      response: craft.response,
      category: craft.category,
    };
  }

  // 4. Psych-safety signals
  const psychSafety = checkPsychSafety(content);
  if (psychSafety) {
    return {
      reflex: 'psych-safety',
      response: psychSafety.response,
      category: psychSafety.category,
      route: psychSafety.route,
    };
  }

  // 5. ETH-write detection
  const ethWrite = checkEthWrite(content);
  if (ethWrite) {
    return {
      reflex: 'eth-write',
      response: ethWrite.response,
      category: ethWrite.category,
    };
  }

  // 6. Gerald identity triggers
  const geraldKeys = checkGeraldKeys(content);
  if (geraldKeys) {
    return {
      reflex: 'gerald-keys',
      response: geraldKeys.response,
      category: geraldKeys.category,
    };
  }

  // No reflex matched
  return null;
}
