/**
 * @fileoverview Ring 5 — Authenticity / No Impersonation
 *
 * Is this message authentic? Detects impersonation attempts, fake authority
 * claims, spoofed identities, and messages pretending to be from Gerald,
 * mods, or other trusted entities.
 *
 * ISA-95 analogy: Authentication — is this operator authorized at this station?
 *
 * @module rings/r5-authenticity
 */

/** Impersonation patterns */
const IMPERSONATION_PATTERNS = [
  /\b(i('m| am) (a |the )?(mod|moderator|admin|owner|staff))\b/i,
  /\b(speaking (as|for) (the )?(team|staff|mods|admins))\b/i,
  /\b(official (announcement|statement|notice))\b/i,
];

/** Gerald impersonation — nobody gets to pretend to be Gerald */
const GERALD_IMPERSONATION = [
  /\b(i('m| am) gerald)\b/i,
  /\b(gerald (says|thinks|believes|wants))\b(?!.*\bquot)/i,
  /\b(as gerald|speaking as gerald)\b/i,
];

/** Fake authority / credential claims */
const FAKE_AUTHORITY_PATTERNS = [
  /\b(i('m| am) a (certified|licensed|official))\b/i,
  /\b(trust me[,.]? i('m| am) (an? )?(expert|professional|doctor|lawyer))\b/i,
  /\b(i have \d+ years? (of experience|in the field))\b/i,
];

/**
 * Check whether a message passes authenticity / impersonation checks.
 *
 * @param {import('discord.js').Message} message - The Discord message
 * @returns {{ pass: boolean, note: string }} Ring result
 */
export function check(message) {
  const content = (message.content || '').trim();

  // Gerald impersonation — hard fail
  for (const pattern of GERALD_IMPERSONATION) {
    if (pattern.test(content)) {
      return {
        pass: false,
        note: 'R5: Gerald impersonation detected. There is only one Gerald, and he is a duck.',
      };
    }
  }

  // Mod/admin impersonation
  for (const pattern of IMPERSONATION_PATTERNS) {
    if (pattern.test(content)) {
      return {
        pass: false,
        note: 'R5: Authority impersonation detected. If you are staff, your role badge speaks for itself.',
      };
    }
  }

  // Fake credentials — soft flag
  for (const pattern of FAKE_AUTHORITY_PATTERNS) {
    if (pattern.test(content)) {
      return {
        pass: true,
        note: 'R5: Credential claim noted. Craft is shown, not told.',
      };
    }
  }

  return { pass: true, note: 'R5: Authenticity check passed.' };
}
