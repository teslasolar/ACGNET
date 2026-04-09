#!/usr/bin/env node
/**
 * ACG-NET Discovery Script
 *
 * Reads data/registry.json, fetches each member's manifest.json,
 * validates schema, aggregates into data/network.json, computes
 * rankings/achievements/leaderboard, and rebuilds the hub index.
 *
 * Runs as a GitHub Actions cron job (hourly) or manually.
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '..', 'data', 'registry.json');
const NETWORK_PATH = path.join(__dirname, '..', 'data', 'network.json');

// Brain tier thresholds
const BRAIN_TIERS = [
  { name: 'Smooth Brain',       emoji: '\u{1F9E0}',           color: '#888888', min_points: 0 },
  { name: 'Wrinkled Brain',     emoji: '\u{1F9E0}\u2728',     color: '#5b9bd5', min_points: 100 },
  { name: 'Big Brain',          emoji: '\u{1F9E0}\u{1F525}',  color: '#4ae08a', min_points: 500 },
  { name: 'Galaxy Brain',       emoji: '\u{1F9E0}\u{1F30C}',  color: '#d4883a', min_points: 1500 },
  { name: 'Cosmic Brain',       emoji: '\u{1F9E0}\u{1FA90}',  color: '#aa44ff', min_points: 5000 },
  { name: 'Transcendent Brain', emoji: '\u{1F9E0}\u26A1',     color: '#ffd700', min_points: 10000 }
];

// Point values for contribution scoring
const POINT_VALUES = {
  attend_session:        10,
  pass_eliza_vetting:   100,
  publish_post:          50,
  publish_project:      100,
  serve_as_reviewer:    200,
  serve_as_auditor:     500,
  process_refusal:      300,
  file_ethical_refusal: 200,
  contribute_to_spec:   300,
  contribute_to_tool:   400,
  mentor_new_member:    150,
  present_at_session:   100,
  recruit_new_member:    50
};

// Achievement definitions
const ACHIEVEMENTS = {
  first_steps:      { name: 'First Steps',      icon: '\u{1F463}', rarity: 'common' },
  the_interview:    { name: 'The Interview',     icon: '\u{1F50D}', rarity: 'common' },
  wordsmith:        { name: 'Wordsmith',         icon: '\u270D\uFE0F', rarity: 'common' },
  prolific:         { name: 'Prolific',          icon: '\u{1F4DA}', rarity: 'uncommon' },
  toolmaker:        { name: 'Toolmaker',         icon: '\u{1F527}', rarity: 'rare' },
  white_paper:      { name: 'White Paper',       icon: '\u{1F4DC}', rarity: 'rare' },
  spec_writer:      { name: 'Spec Writer',       icon: '\u{1F4D0}', rarity: 'epic' },
  gate_keeper:      { name: 'Gate Keeper',       icon: '\u{1F6AA}', rarity: 'uncommon' },
  the_auditor:      { name: 'The Auditor',       icon: '\u{1F50E}', rarity: 'rare' },
  i_said_no:        { name: 'I Said No',         icon: '\u270B',    rarity: 'rare' },
  guardian:          { name: 'Guardian',          icon: '\u{1F6E1}\uFE0F', rarity: 'epic' },
  shield_wall:      { name: 'Shield Wall',       icon: '\u2694\uFE0F', rarity: 'epic' },
  regular:          { name: 'Regular',           icon: '\u2615',    rarity: 'common' },
  mentor:           { name: 'Mentor',            icon: '\u{1F393}', rarity: 'uncommon' },
  recruiter:        { name: 'Recruiter',         icon: '\u{1F4E2}', rarity: 'uncommon' },
  founding_hammer:  { name: 'Founding Hammer',   icon: '\u2692\uFE0F', rarity: 'legendary' },
  galaxy_brain:     { name: 'Galaxy Brain',      icon: '\u{1F30C}', rarity: 'legendary' },
  equation_breaker: { name: 'Equation Breaker',  icon: '\u{1F4A5}', rarity: 'legendary' },
  chain_runner:     { name: 'Chain Runner',      icon: '\u{1F517}', rarity: 'rare' }
};

/**
 * Validate a member manifest against ACG-DISCOVER-v1 schema
 */
function validateManifest(manifest) {
  if (!manifest) return false;
  if (manifest.acg_protocol !== 'ACG-DISCOVER-v1') return false;
  if (!manifest.member) return false;
  if (!manifest.member.handle || !manifest.member.github) return false;
  if (!manifest.member.site_url) return false;
  if (!manifest.stats) return false;
  if (!manifest.content) return false;
  return true;
}

/**
 * Compute contribution score from stats
 */
function computeScore(stats) {
  let score = 0;
  score += (stats.sessions_attended || 0) * POINT_VALUES.attend_session;
  score += (stats.vettings_passed || 0) * POINT_VALUES.pass_eliza_vetting;
  score += (stats.publications || 0) * POINT_VALUES.publish_post;
  score += (stats.contributions || 0) * POINT_VALUES.contribute_to_tool;
  score += (stats.refusals_filed || 0) * POINT_VALUES.file_ethical_refusal;
  score += (stats.audits_served || 0) * POINT_VALUES.serve_as_auditor;
  return score;
}

/**
 * Determine brain tier from score
 */
function getBrainTier(score) {
  let tier = BRAIN_TIERS[0];
  for (const t of BRAIN_TIERS) {
    if (score >= t.min_points) tier = t;
  }
  return tier;
}

/**
 * Fetch a manifest from a URL with timeout
 */
async function fetchManifest(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Build the content river from all members' posts
 */
function buildContentRiver(members) {
  const allPosts = [];
  for (const member of members) {
    if (!member.content || !member.content.posts) continue;
    for (const post of member.content.posts) {
      allPosts.push({
        ...post,
        author: member.handle,
        author_url: member.site_url,
        author_tier: member.brain_tier
      });
    }
  }
  allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return allPosts.slice(0, 100);
}

/**
 * Main discovery function
 */
async function discoverNetwork() {
  console.log('[ACG-NET] Starting network discovery...');

  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  const members = [];
  let onlineCount = 0;

  for (const entry of registry.members) {
    console.log(`[ACG-NET] Fetching manifest for ${entry.handle}...`);
    const manifest = await fetchManifest(entry.manifest_url);

    if (!manifest) {
      console.log(`[ACG-NET]   -> OFFLINE: ${entry.handle}`);
      members.push({
        handle: entry.handle,
        github: entry.handle,
        site_url: '',
        status: 'offline',
        last_seen: null,
        registered: entry.registered,
        score: 0,
        brain_tier: BRAIN_TIERS[0],
        achievements: [],
        stats: {},
        content: { posts: [], projects: [], resources: [] }
      });
      continue;
    }

    if (!validateManifest(manifest)) {
      console.log(`[ACG-NET]   -> INVALID SCHEMA: ${entry.handle}`);
      members.push({
        handle: entry.handle,
        github: entry.handle,
        site_url: '',
        status: 'invalid',
        last_seen: null,
        registered: entry.registered,
        score: 0,
        brain_tier: BRAIN_TIERS[0],
        achievements: [],
        stats: {},
        content: { posts: [], projects: [], resources: [] }
      });
      continue;
    }

    const score = computeScore(manifest.stats);
    const tier = getBrainTier(score);
    onlineCount++;

    members.push({
      handle: manifest.member.handle,
      github: manifest.member.github,
      joined: manifest.member.joined,
      tagline: manifest.member.tagline,
      avatar_url: manifest.member.avatar_url,
      site_url: manifest.member.site_url,
      status: 'online',
      last_seen: new Date().toISOString(),
      registered: entry.registered,
      score,
      brain_tier: tier,
      achievements: manifest.achievements || [],
      stats: manifest.stats,
      content: manifest.content
    });

    console.log(`[ACG-NET]   -> ONLINE: ${manifest.member.handle} (${tier.name}, ${score} pts)`);
  }

  // Sort by score descending for leaderboard
  const leaderboard = [...members]
    .filter(m => m.status === 'online')
    .sort((a, b) => b.score - a.score)
    .map((m, i) => ({
      rank: i + 1,
      handle: m.handle,
      site_url: m.site_url,
      score: m.score,
      brain_tier: m.brain_tier,
      achievement_count: m.achievements.length
    }));

  // Assign rank back to members
  for (const entry of leaderboard) {
    const member = members.find(m => m.handle === entry.handle);
    if (member) member.rank = entry.rank;
  }

  // Build content river
  const contentRiver = buildContentRiver(members);

  // Aggregate stats
  const totalPosts = members.reduce((s, m) => s + (m.content.posts ? m.content.posts.length : 0), 0);
  const totalAchievements = members.reduce((s, m) => s + m.achievements.length, 0);
  const totalRefusals = members.reduce((s, m) => s + (m.stats.refusals_filed || 0), 0);

  const network = {
    acg_protocol: 'ACG-DISCOVER-v1',
    stats: {
      total_members: members.length,
      total_online: onlineCount,
      total_posts: totalPosts,
      total_achievements: totalAchievements,
      total_refusals_protected: totalRefusals,
      total_certifications: 0
    },
    members,
    leaderboard,
    content_river: contentRiver,
    updated: new Date().toISOString()
  };

  fs.writeFileSync(NETWORK_PATH, JSON.stringify(network, null, 2));
  console.log(`[ACG-NET] Discovery complete. ${members.length} members (${onlineCount} online).`);
  console.log(`[ACG-NET] Network state written to ${NETWORK_PATH}`);
}

discoverNetwork().catch(err => {
  console.error('[ACG-NET] Discovery failed:', err);
  process.exit(1);
});
