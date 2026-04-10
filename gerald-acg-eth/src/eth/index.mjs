/**
 * @fileoverview ETH (Emotional Throughput Handler) module initializer.
 *
 * ETH integrates ISA-95 / ISA-18.2 industrial control concepts into
 * Gerald's therapeutic and community-safety functions.
 *
 * @module eth
 */

import { detectAlarmFlood, respondToFlood } from './alarm-flood.mjs';
import { WorkOrder } from './pack-ml.mjs';
import { translate } from './translate.mjs';

/** @type {import('discord.js').Client | null} */
let _client = null;

/**
 * Initialize the ETH module with the Discord client reference.
 *
 * @param {import('discord.js').Client} client - The Discord.js client
 */
export function initEth(client) {
  _client = client;
  console.log('[ETH] Module initialized — ISA-95 mapping active');
}

export { detectAlarmFlood, respondToFlood, WorkOrder, translate };
