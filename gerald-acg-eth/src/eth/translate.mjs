/**
 * @fileoverview ETH Translate — The /translate therapeutic function.
 *
 * Accepts raw L0/L1 signal (unprocessed emotional/somatic data) and
 * produces a READ-only artifact. Gerald does NOT interpret, diagnose,
 * or prescribe (that would be WRITE). He only observes and reflects.
 *
 * Template structure:
 *   1. Notice signals (body, sense, affect)
 *   2. Pattern observation (without interpretation)
 *   3. No instruction (explicitly)
 *   4. Routing options (P3, P3b, P4, L5)
 *
 * @module eth/translate
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {string[]} */
let translatePool;
try {
  translatePool = require('../../src/voice/pools/translate.json');
} catch {
  translatePool = [
    'I notice a signal here.',
    'Something is present in what you describe.',
    'The body sometimes speaks before the mind has words.',
  ];
}

/**
 * Signal categories for READ-only observation.
 * @enum {string}
 */
const SIGNAL_TYPES = {
  BODY: 'body',
  SENSE: 'sense',
  AFFECT: 'affect',
};

/** Body/somatic signal keywords */
const BODY_SIGNALS = [
  /\b(tight|tense|heavy|numb|pain|ache|stomach|chest|throat|jaw|shoulders?|headache|exhausted?|tired|shak(e|ing|y))\b/i,
];

/** Sensory signal keywords */
const SENSE_SIGNALS = [
  /\b(loud|quiet|dark|bright|cold|hot|sharp|dull|buzzing|ringing|nauseous|dizzy|foggy)\b/i,
];

/** Affect signal keywords */
const AFFECT_SIGNALS = [
  /\b(angry|sad|scared|anxious|overwhelmed|frustrated|confused|numb|empty|lost|stuck|hopeless|helpless|ashamed)\b/i,
];

/**
 * Detect signal types present in raw input.
 *
 * @param {string} raw - Raw input text
 * @returns {{ body: string[], sense: string[], affect: string[] }} Detected signals
 */
function detectSignals(raw) {
  const signals = { body: [], sense: [], affect: [] };

  for (const pattern of BODY_SIGNALS) {
    const matches = raw.match(pattern);
    if (matches) signals.body.push(...matches.map((m) => m.toLowerCase()));
  }

  for (const pattern of SENSE_SIGNALS) {
    const matches = raw.match(pattern);
    if (matches) signals.sense.push(...matches.map((m) => m.toLowerCase()));
  }

  for (const pattern of AFFECT_SIGNALS) {
    const matches = raw.match(pattern);
    if (matches) signals.affect.push(...matches.map((m) => m.toLowerCase()));
  }

  return signals;
}

/**
 * Generate a random observation from the translate pool.
 *
 * @returns {string} A READ-only observation string
 */
function randomObservation() {
  return translatePool[Math.floor(Math.random() * translatePool.length)];
}

/**
 * Translate raw L0/L1 signal into a READ-only artifact.
 *
 * Gerald observes. Gerald does not advise.
 *
 * @param {string} rawInput - The raw emotional/somatic signal text
 * @returns {string} A formatted READ-only translation artifact
 */
export function translate(rawInput) {
  const signals = detectSignals(rawInput);
  const lines = [];

  // --- Section 1: Notice Signals ---
  lines.push('**Signals noticed:**');

  if (signals.body.length > 0) {
    lines.push(`  Body: ${signals.body.join(', ')}`);
  }
  if (signals.sense.length > 0) {
    lines.push(`  Sense: ${signals.sense.join(', ')}`);
  }
  if (signals.affect.length > 0) {
    lines.push(`  Affect: ${signals.affect.join(', ')}`);
  }
  if (signals.body.length === 0 && signals.sense.length === 0 && signals.affect.length === 0) {
    lines.push(`  ${randomObservation()}`);
  }

  lines.push('');

  // --- Section 2: Pattern Observation ---
  lines.push('**Pattern observed:**');
  const totalSignals = signals.body.length + signals.sense.length + signals.affect.length;

  if (totalSignals === 0) {
    lines.push('  The signal is present but not yet differentiated. That is normal.');
  } else if (totalSignals <= 2) {
    lines.push('  A focused signal — one or two channels active.');
  } else if (totalSignals <= 5) {
    lines.push('  Multiple signal channels active. The system is communicating on several frequencies.');
  } else {
    lines.push('  High signal density. Many channels active simultaneously. This may feel overwhelming — that makes sense.');
  }

  lines.push('');

  // --- Section 3: No Instruction (explicit) ---
  lines.push('**Gerald does not instruct.**');
  lines.push('  No advice is given here. No diagnosis. No prescription.');
  lines.push('  This is a mirror, not a map.');

  lines.push('');

  // --- Section 4: Routing Options ---
  lines.push('**If you want to go further:**');
  lines.push('  P3  — Talk to a trusted human about what you noticed.');
  lines.push('  P3b — Explore this with someone you have an attachment bond with.');
  lines.push('  P4  — If this feels urgent or dangerous, contact a crisis line (988 in US).');
  lines.push('  L5  — Seek a licensed clinician for ongoing support.');

  return lines.join('\n');
}
