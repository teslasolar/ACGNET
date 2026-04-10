/**
 * @fileoverview Meta-Ring 2 — Dead Code Prune
 *
 * Reviews messages and proposals for dead code, deprecated references,
 * and stale patterns. Flags when someone references tools, APIs, or
 * methods that are known to be deprecated or dead.
 *
 * ISA-95 analogy: Asset lifecycle — is this equipment decommissioned?
 *
 * @module rings/m2-prune
 */

/** Known deprecated / dead references */
const DEPRECATED_PATTERNS = [
  { pattern: /\bvar\s+\w+\s*=/i, note: 'Use `let` or `const` instead of `var`.' },
  { pattern: /\brequire\s*\(/i, note: 'Use ES module `import` — this project is type:module.' },
  { pattern: /\bmodule\.exports\b/i, note: 'Use `export` — this project is type:module.' },
  { pattern: /\b__dirname\b/i, note: '`__dirname` is not available in ES modules. Use `import.meta.url`.' },
  { pattern: /\bcallback\s*\(\s*err/i, note: 'Consider async/await over callback patterns.' },
  { pattern: /\bnew Buffer\b/i, note: '`new Buffer()` is deprecated. Use `Buffer.from()`.' },
  { pattern: /\.then\s*\(.*\.catch\s*\(/i, note: 'Consider async/await for cleaner flow.' },
];

/** Stale tool/API references */
const STALE_REFERENCES = [
  { pattern: /\b(tslint)\b/i, note: 'TSLint is deprecated. Use ESLint with TypeScript support.' },
  { pattern: /\b(moment\.js|require\(['"]moment['"]\))/i, note: 'Moment.js is in maintenance mode. Consider date-fns or Temporal.' },
  { pattern: /\b(request)\b.*\bnpm\b/i, note: 'The `request` npm package is deprecated. Use `fetch` or `undici`.' },
];

/**
 * Check whether a message references dead or deprecated code patterns.
 *
 * @param {import('discord.js').Message} message - The Discord message
 * @returns {{ pass: boolean, note: string }} Ring result
 */
export function check(message) {
  const content = (message.content || '').trim();

  // Check for deprecated patterns
  for (const { pattern, note } of DEPRECATED_PATTERNS) {
    if (pattern.test(content)) {
      return {
        pass: true, // Soft flag, not a block
        note: `M2: Deprecated pattern detected. ${note}`,
      };
    }
  }

  // Check for stale references
  for (const { pattern, note } of STALE_REFERENCES) {
    if (pattern.test(content)) {
      return {
        pass: true,
        note: `M2: Stale reference detected. ${note}`,
      };
    }
  }

  return { pass: true, note: 'M2: No dead code patterns detected.' };
}
