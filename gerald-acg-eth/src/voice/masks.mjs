/**
 * @fileoverview Voice Masks — Gerald's three-layer voice system.
 *
 * Gerald speaks through three masks depending on context:
 *   - craft (formal)  — The default. Professional, measured, precise.
 *   - cass (kotoba)    — The oracle. Cryptic, poetic, pattern-language.
 *   - bare (italianate) — The duck. Raw, direct, no filter, occasional Italian.
 *
 * Mask selection is context-dependent:
 *   - Technical channels -> craft
 *   - Philosophy/meta channels -> cass
 *   - General/casual channels -> bare
 *   - Crisis/safety -> craft (always professional in crisis)
 *
 * @module voice/masks
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** Voice pools loaded from JSON */
const pools = {
  formal: loadPool('../voice/pools/formal.json'),
  kotoba: loadPool('../voice/pools/kotoba.json'),
  bare: loadPool('../voice/pools/bare.json'),
  translate: loadPool('../voice/pools/translate.json'),
  refusal: loadPool('../voice/pools/refusal.json'),
  'slop-call': loadPool('../voice/pools/slop-call.json'),
};

/**
 * Safely load a JSON voice pool.
 *
 * @param {string} path - Relative path to the JSON pool file
 * @returns {string[]} Array of voice strings, or fallback
 */
function loadPool(path) {
  try {
    return require(path);
  } catch {
    return ['[voice pool not loaded]'];
  }
}

/**
 * Channel name patterns for mask selection.
 * @type {Record<string, RegExp>}
 */
const CHANNEL_PATTERNS = {
  craft: /\b(dev|code|tech|engineering|build|ship|review|pr|ci|cd)\b/i,
  cass: /\b(philosophy|meta|theory|abstract|oracle|ritual|lore)\b/i,
  bare: /\b(general|casual|off-topic|lounge|hangout|chat|meme)\b/i,
};

/**
 * Determine which mask Gerald should use based on context.
 *
 * @param {Object} context
 * @param {import('discord.js').TextChannel} [context.channel] - The channel
 * @param {import('discord.js').Guild} [context.guild] - The guild
 * @param {boolean} [context.crisis=false] - Whether this is a crisis context
 * @returns {'craft'|'cass'|'bare'} The selected mask
 */
export function getMask(context = {}) {
  // Crisis always gets craft (professional)
  if (context.crisis) return 'craft';

  // Check channel name for pattern matches
  const channelName = context.channel?.name || '';

  if (CHANNEL_PATTERNS.craft.test(channelName)) return 'craft';
  if (CHANNEL_PATTERNS.cass.test(channelName)) return 'cass';
  if (CHANNEL_PATTERNS.bare.test(channelName)) return 'bare';

  // Default to craft
  return 'craft';
}

/**
 * Select a random phrase from a voice pool.
 *
 * @param {'craft'|'cass'|'bare'} mask - The active mask
 * @param {string} [category] - Optional category override (e.g., 'refusal', 'slop-call')
 * @returns {string} A random phrase from the appropriate pool
 */
export function speak(mask, category) {
  // Category override takes priority
  if (category && pools[category]) {
    const pool = pools[category];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Map mask to pool
  const poolMap = {
    craft: 'formal',
    cass: 'kotoba',
    bare: 'bare',
  };

  const poolName = poolMap[mask] || 'formal';
  const pool = pools[poolName] || pools.formal;

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get all available masks.
 *
 * @returns {string[]} List of mask names
 */
export function listMasks() {
  return ['craft', 'cass', 'bare'];
}
