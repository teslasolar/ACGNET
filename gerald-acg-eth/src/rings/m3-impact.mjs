/**
 * @fileoverview Meta-Ring 3 — Cross-Project Impact
 *
 * Reviews messages that reference or affect multiple projects within the
 * ACG network. Ensures cross-project changes are communicated, coordinated,
 * and don't break downstream consumers.
 *
 * ISA-95 analogy: Supply chain impact — does this change affect other plants?
 *
 * @module rings/m3-impact
 */

/** Patterns indicating cross-project references */
const CROSS_PROJECT_MARKERS = [
  /\b(cross[- ]project|multi[- ]repo|monorepo|shared (lib|library|module))\b/i,
  /\b(breaking change|api change|schema (change|migration))\b/i,
  /\b(downstream|upstream|consumer|dependency)\b/i,
  /\b(affects? (all|multiple|other) (projects?|repos?|services?))\b/i,
];

/** Impact escalation patterns */
const HIGH_IMPACT_PATTERNS = [
  /\b(breaking|major)\s+(change|update|migration)\b/i,
  /\b(remove|delete|drop)\s+(the\s+)?(api|endpoint|table|column|field)\b/i,
  /\b(rename|move)\s+(the\s+)?(package|module|namespace)\b/i,
];

/** Required communication markers for cross-project changes */
const COMMUNICATION_MARKERS = {
  notification: /\b(notify|inform|heads[- ]up|fyi|announcement)\b/i,
  timeline: /\b(timeline|deadline|by\s+(monday|tuesday|wednesday|thursday|friday|next week|eow))\b/i,
  migration: /\b(migration (guide|path|plan)|how to (update|migrate|upgrade))\b/i,
};

/**
 * Check whether cross-project impact is properly communicated.
 *
 * @param {import('discord.js').Message} message - The Discord message
 * @returns {{ pass: boolean, note: string }} Ring result
 */
export function check(message) {
  const content = (message.content || '').trim();

  // Only trigger on cross-project references
  const isCrossProject = CROSS_PROJECT_MARKERS.some((p) => p.test(content));
  if (!isCrossProject) {
    return { pass: true, note: 'M3: No cross-project impact detected — ring skipped.' };
  }

  // High-impact changes need extra communication
  const isHighImpact = HIGH_IMPACT_PATTERNS.some((p) => p.test(content));
  if (isHighImpact) {
    const missing = [];
    for (const [marker, pattern] of Object.entries(COMMUNICATION_MARKERS)) {
      if (!pattern.test(content)) {
        missing.push(marker);
      }
    }

    if (missing.length > 0) {
      return {
        pass: false,
        note: `M3: High-impact cross-project change detected. Missing: ${missing.join(', ')}. Coordinate before shipping.`,
      };
    }
  }

  return { pass: true, note: 'M3: Cross-project impact noted and appears communicated.' };
}
