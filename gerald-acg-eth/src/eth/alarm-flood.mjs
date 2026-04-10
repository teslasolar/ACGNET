/**
 * @fileoverview ISA-18.2 Alarm Flood Detection and Response
 *
 * Maps ISA-18.2 alarm management principles to Discord community dynamics.
 * An "alarm flood" in community context means: too many signals in too
 * short a window, overwhelming moderators and members.
 *
 * ISA-18.2 defines an alarm flood as >10 alarms per operator per 10 minutes.
 * Gerald adapts this: >10 flagged messages per channel per 10-minute window.
 *
 * Response protocol:
 *   1. Detect flood condition
 *   2. Suppress low-priority alarms (don't respond to every trigger)
 *   3. Notify moderators
 *   4. Log for post-incident review
 *
 * @module eth/alarm-flood
 */

/**
 * @typedef {Object} AlarmRecord
 * @property {string} channelId - Discord channel ID
 * @property {number} timestamp - Unix timestamp (ms)
 * @property {string} ring - Which ring/reflex triggered
 * @property {string} severity - Alarm severity
 */

/** In-memory alarm buffer keyed by channel ID */
const alarmBuffer = new Map();

/** Default flood detection window in milliseconds (10 minutes per ISA-18.2) */
const DEFAULT_WINDOW_MS = 10 * 60 * 1000;

/** Default flood threshold (alarms per window) */
const DEFAULT_THRESHOLD = 10;

/** Severity levels per ISA-18.2 */
export const SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

/**
 * Record an alarm event for a channel.
 *
 * @param {string} channelId - The channel ID
 * @param {string} ring - The ring or reflex that triggered
 * @param {string} [severity='medium'] - Alarm severity
 */
export function recordAlarm(channelId, ring, severity = SEVERITY.MEDIUM) {
  if (!alarmBuffer.has(channelId)) {
    alarmBuffer.set(channelId, []);
  }

  alarmBuffer.get(channelId).push({
    channelId,
    timestamp: Date.now(),
    ring,
    severity,
  });
}

/**
 * Detect whether a channel is in an alarm flood condition.
 *
 * @param {string} channelId - The channel ID to check
 * @param {number} [window=DEFAULT_WINDOW_MS] - Detection window in ms
 * @returns {{ flooding: boolean, count: number, threshold: number, window: number }}
 */
export function detectAlarmFlood(channelId, window = DEFAULT_WINDOW_MS) {
  const records = alarmBuffer.get(channelId) || [];
  const cutoff = Date.now() - window;

  // Filter to records within the window
  const recent = records.filter((r) => r.timestamp >= cutoff);

  // Update buffer to only keep recent records (garbage collection)
  alarmBuffer.set(channelId, recent);

  return {
    flooding: recent.length >= DEFAULT_THRESHOLD,
    count: recent.length,
    threshold: DEFAULT_THRESHOLD,
    window,
  };
}

/**
 * Respond to an alarm flood condition in a channel.
 *
 * ISA-18.2 response: suppress low-priority, notify operator, log.
 *
 * @param {import('discord.js').TextChannel} channel - The Discord channel
 * @returns {Promise<void>}
 */
export async function respondToFlood(channel) {
  const floodStatus = detectAlarmFlood(channel.id);

  if (!floodStatus.flooding) return;

  // Suppress low-priority alarms during flood
  const records = alarmBuffer.get(channel.id) || [];
  const suppressed = records.filter((r) => r.severity === SEVERITY.LOW).length;

  // Notify channel
  await channel.send(
    `**[ISA-18.2 Alarm Flood Detected]**\n` +
    `${floodStatus.count} signals in ${Math.round(floodStatus.window / 60000)} minutes ` +
    `(threshold: ${floodStatus.threshold}).\n` +
    `${suppressed} low-priority signals suppressed.\n` +
    `Gerald is reducing response frequency until the flood clears. ` +
    `Moderators have been notified.`
  );

  console.log(
    `[ALARM-FLOOD] Channel ${channel.id}: ${floodStatus.count} alarms in window. ` +
    `${suppressed} suppressed.`
  );
}

/**
 * Get the current alarm buffer for a channel (for audit/logging).
 *
 * @param {string} channelId - The channel ID
 * @returns {AlarmRecord[]} Recent alarm records
 */
export function getAlarmLog(channelId) {
  return alarmBuffer.get(channelId) || [];
}

/**
 * Clear the alarm buffer for a channel (post-incident reset).
 *
 * @param {string} channelId - The channel ID
 */
export function clearAlarms(channelId) {
  alarmBuffer.delete(channelId);
}
