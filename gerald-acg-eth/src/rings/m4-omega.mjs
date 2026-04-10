/**
 * @fileoverview Meta-Ring 4 — Omega / Final Sign-Off
 *
 * The final meta-ring. Only Master-level (L3+) and Elder (L4) members
 * can pass this ring. Used for final approvals on RFCs, major changes,
 * and governance decisions.
 *
 * ISA-95 analogy: Quality release — final QA sign-off before shipping.
 *
 * @module rings/m4-omega
 */

/** Role IDs or names that qualify as Master+ (L3/L4) */
const MASTER_ROLES = ['master', 'elder', 'l3', 'l4', 'founder'];

/** Patterns indicating a sign-off action */
const SIGNOFF_MARKERS = [
  /\b(approved?|sign[- ]?off|lgtm|ship it|merge it)\b/i,
  /\b(accepted?|ratified?|confirmed?)\b/i,
  /\b(\+1|thumbs[- ]?up|green[- ]?light)\b/i,
];

/** Patterns indicating governance-level decisions */
const GOVERNANCE_MARKERS = [
  /\b(governance|charter (change|update|amendment))\b/i,
  /\b(role (change|promotion|demotion))\b/i,
  /\b(ban|exile|removal)\b/i,
  /\b(treasury|fund|budget|allocation)\b/i,
];

/**
 * Check whether a sign-off or governance action is authorized.
 *
 * @param {import('discord.js').Message} message - The Discord message
 * @returns {{ pass: boolean, note: string }} Ring result
 */
export function check(message) {
  const content = (message.content || '').trim();

  // Only trigger on sign-off or governance actions
  const isSignoff = SIGNOFF_MARKERS.some((p) => p.test(content));
  const isGovernance = GOVERNANCE_MARKERS.some((p) => p.test(content));

  if (!isSignoff && !isGovernance) {
    return { pass: true, note: 'M4: Not a sign-off or governance action — ring skipped.' };
  }

  // Check if user has Master+ role
  const member = message.member;
  if (!member) {
    return {
      pass: false,
      note: 'M4: Cannot verify role — member data unavailable. Sign-off requires Master+ (L3/L4).',
    };
  }

  const roles = member.roles?.cache?.map((r) => r.name.toLowerCase()) || [];
  const hasMasterRole = roles.some((role) =>
    MASTER_ROLES.some((master) => role.includes(master))
  );

  if (!hasMasterRole) {
    if (isGovernance) {
      return {
        pass: false,
        note: 'M4: Governance decisions require Master+ (L3/L4) authority. Your voice is heard, but sign-off requires rank.',
      };
    }
    return {
      pass: false,
      note: 'M4: Final sign-off requires Master+ (L3/L4) role. Keep building — you\'ll get there.',
    };
  }

  return { pass: true, note: 'M4: Master+ sign-off authorized. Omega ring passed.' };
}
