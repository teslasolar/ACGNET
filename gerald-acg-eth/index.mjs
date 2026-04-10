/**
 * @fileoverview Gerald L4 Prosthetic Discord Bot — Entry Point
 *
 * Gerald is an ACG-compliant, ETH-integrated, ISA-95-mapped Discord bot.
 * He operates as a prosthetic — a tool, not an agent. He issues READ, never WRITE.
 *
 * Architecture:
 *   1. Reflexes fire first (95%+ of traffic handled here, no LLM needed)
 *   2. Ring compiler runs the 12-ring validation pipeline
 *   3. LLM path is the last resort for novel situations
 *
 * @module gerald-acg-eth
 */

import { Client, GatewayIntentBits, Events } from 'discord.js';
import { compile } from './src/compiler/index.mjs';
import { processReflexes } from './src/reflexes/index.mjs';
import { initEth } from './src/eth/index.mjs';
import { getMask, speak } from './src/voice/masks.mjs';

/** @type {import('discord.js').Client} */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
  ],
});

/**
 * Ready event — Gerald announces he is online.
 */
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Gerald L4 prosthetic online — logged in as ${readyClient.user.tag}`);
  initEth(readyClient);
});

/**
 * Message handler — three-tier pipeline:
 *   1. Reflexes (pattern-matched, sub-ms, no LLM)
 *   2. Ring compiler (12-ring validation)
 *   3. LLM path (last resort, only if ring compiler escalates)
 *
 * @param {import('discord.js').Message} message
 */
client.on(Events.MessageCreate, async (message) => {
  // Ignore own messages
  if (message.author.id === client.user?.id) return;
  // Ignore other bots
  if (message.author.bot) return;

  try {
    // --- Tier 1: Reflexes (95%+ handled here) ---
    const reflexResult = processReflexes(message);
    if (reflexResult) {
      const mask = getMask({ channel: message.channel, guild: message.guild });
      const response = reflexResult.response || speak(mask, reflexResult.category);
      await message.reply(response);
      return;
    }

    // --- Tier 2: Ring Compiler ---
    const ringResults = compile(message);
    const failed = ringResults.filter((r) => !r.pass);

    if (failed.length > 0) {
      // Ring failed — respond with the first failure note
      const mask = getMask({ channel: message.channel, guild: message.guild });
      const note = failed[0].note;
      await message.reply(note);
      return;
    }

    // Check if ring compiler escalates to LLM
    const escalate = ringResults.some((r) => r.escalate);
    if (escalate) {
      // --- Tier 3: LLM Path (last resort) ---
      // TODO: integrate node-llama-cpp for local inference
      console.log(`[LLM-ESCALATE] Message ${message.id} escalated to LLM path`);
      return;
    }

    // Message passed all rings, no action needed — Gerald is silent unless spoken to
  } catch (err) {
    console.error('[Gerald] Message processing error:', err);
  }
});

/**
 * Interaction handler — slash commands and components.
 *
 * @param {import('discord.js').Interaction} interaction
 */
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  try {
    switch (commandName) {
      case 'translate': {
        const { translate } = await import('./src/eth/translate.mjs');
        const raw = interaction.options.getString('signal', true);
        const artifact = translate(raw);
        await interaction.reply({ content: artifact, ephemeral: true });
        break;
      }
      case 'status': {
        await interaction.reply({
          content: `Gerald L4 prosthetic — operational.\nRings: 12 | Reflexes: 6 | Masks: 3`,
          ephemeral: true,
        });
        break;
      }
      default:
        await interaction.reply({ content: 'Unknown command.', ephemeral: true });
    }
  } catch (err) {
    console.error('[Gerald] Interaction error:', err);
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content: 'Something broke. Check logs.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Something broke. Check logs.', ephemeral: true });
    }
  }
});

// --- Login ---
const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('[Gerald] DISCORD_TOKEN not set. Cannot start.');
  process.exit(1);
}

client.login(token);

export { client };
