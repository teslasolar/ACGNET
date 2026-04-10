/**
 * @fileoverview 12-Ring Compiler — Full validation pipeline.
 *
 * Runs a message through all 12 rings (R0-R6 + M0-M4) and returns
 * the complete results array. Each ring returns {pass, note} and
 * optionally {escalate, route}.
 *
 * Ring order:
 *   R0 — Ground / Existence check
 *   R1 — Signal-to-noise
 *   R2 — Charter compliance
 *   R3 — Psych safety / tone
 *   R4 — Technical claim verification
 *   R5 — Authenticity / no impersonation
 *   R6 — ACG watermark / meta check
 *   M0 — Hypothesis review (RFC)
 *   M1 — Transform analysis (refactor)
 *   M2 — Dead code prune
 *   M3 — Cross-project impact
 *   M4 — Final sign-off (Master+ only)
 *
 * If R0 fails, no further rings are evaluated (short-circuit).
 * All other rings run independently.
 *
 * @module compiler
 */

import { check as r0 } from '../rings/r0-ground.mjs';
import { check as r1 } from '../rings/r1-signal.mjs';
import { check as r2 } from '../rings/r2-charter.mjs';
import { check as r3 } from '../rings/r3-psych.mjs';
import { check as r4 } from '../rings/r4-technical.mjs';
import { check as r5 } from '../rings/r5-authenticity.mjs';
import { check as r6 } from '../rings/r6-observer.mjs';
import { check as m0 } from '../rings/m0-aether.mjs';
import { check as m1 } from '../rings/m1-transform.mjs';
import { check as m2 } from '../rings/m2-prune.mjs';
import { check as m3 } from '../rings/m3-impact.mjs';
import { check as m4 } from '../rings/m4-omega.mjs';

/**
 * @typedef {Object} RingResult
 * @property {string} ring - Ring identifier (e.g., 'R0', 'M4')
 * @property {boolean} pass - Whether the message passed this ring
 * @property {string} note - Explanation
 * @property {boolean} [escalate] - Whether to escalate to LLM path
 * @property {string} [route] - P-pathway routing (e.g., 'P4')
 */

/** Ring definitions with identifiers and check functions */
const RINGS = [
  { id: 'R0', name: 'Ground',        check: r0 },
  { id: 'R1', name: 'Signal',        check: r1 },
  { id: 'R2', name: 'Charter',       check: r2 },
  { id: 'R3', name: 'Psych',         check: r3 },
  { id: 'R4', name: 'Technical',     check: r4 },
  { id: 'R5', name: 'Authenticity',  check: r5 },
  { id: 'R6', name: 'Observer',      check: r6 },
  { id: 'M0', name: 'Aether',        check: m0 },
  { id: 'M1', name: 'Transform',     check: m1 },
  { id: 'M2', name: 'Prune',         check: m2 },
  { id: 'M3', name: 'Impact',        check: m3 },
  { id: 'M4', name: 'Omega',         check: m4 },
];

/**
 * Run a message through all 12 rings and return the results.
 *
 * @param {import('discord.js').Message} message - The Discord message
 * @returns {RingResult[]} Array of results from all rings
 */
export function compile(message) {
  /** @type {RingResult[]} */
  const results = [];

  for (const ring of RINGS) {
    try {
      const result = ring.check(message);

      /** @type {RingResult} */
      const ringResult = {
        ring: ring.id,
        pass: result.pass,
        note: result.note,
      };

      // Forward optional escalation and routing
      if (result.escalate) ringResult.escalate = result.escalate;
      if (result.route) ringResult.route = result.route;

      results.push(ringResult);

      // R0 short-circuit: if ground check fails, nothing else matters
      if (ring.id === 'R0' && !result.pass) {
        break;
      }
    } catch (err) {
      results.push({
        ring: ring.id,
        pass: true, // Fail-open: if a ring errors, don't block
        note: `${ring.id}: Ring error — ${err.message}. Failing open.`,
      });
    }
  }

  return results;
}
