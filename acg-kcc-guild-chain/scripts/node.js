#!/usr/bin/env node
/**
 * ACG-KCC Node Software
 *
 * Lightweight node implementation for the ACG Guild Chain.
 * Designed to run on Raspberry Pi 4 or any modern computer.
 *
 * Node types:
 *   --authority    L1 block signer (requires committee election)
 *   --validator    L2 block producer (requires 100 GLD stake)
 *   --full         Full chain storage, serves data, no production
 *   --light        Verify proofs, submit transactions
 *
 * Usage:
 *   node node.js --type=full --data-dir=./chain-data --port=30303
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ── Configuration ──

const DEFAULT_CONFIG = {
  type: 'full',
  dataDir: path.join(process.cwd(), 'chain-data'),
  port: 30303,
  rpcPort: 8545,
  genesisPath: path.join(__dirname, '..', 'config', 'genesis.json'),
  l1CheckpointInterval: 50,  // L2 blocks per L1 checkpoint
  l2BlockTime: 5000,         // 5 seconds
  l1BlockTime: 60000         // 60 seconds
};

function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach(arg => {
    const [key, value] = arg.replace(/^--/, '').split('=');
    args[key] = value || true;
  });
  return { ...DEFAULT_CONFIG, ...args };
}

// ── Chain State ──

class ChainState {
  constructor(dataDir) {
    this.dataDir = dataDir;
    this.l1Blocks = [];
    this.l2Blocks = [];
    this.members = new Map();
    this.refusals = new Map();
    this.certifications = new Map();
    this.vettings = new Map();
    this.gldSupply = { total: 510510, circulating: 0, staked: 0, reserve: 127627 };
  }

  init(genesis) {
    fs.mkdirSync(this.dataDir, { recursive: true });
    fs.mkdirSync(path.join(this.dataDir, 'l1'), { recursive: true });
    fs.mkdirSync(path.join(this.dataDir, 'l2'), { recursive: true });

    // Write genesis block
    const genesisBlock = {
      number: 0,
      timestamp: genesis.genesis_timestamp,
      parent_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      state_root: this.computeStateRoot(),
      transactions: [],
      chain_id: genesis.chain_id
    };

    this.l1Blocks.push(genesisBlock);
    this.writeBlock('l1', genesisBlock);
    console.log(`[ACG-KCC] Genesis block written: ${genesis.chain_id}`);
    console.log(`[ACG-KCC] Total GLD supply: ${this.gldSupply.total.toLocaleString()}`);
  }

  computeStateRoot() {
    const state = JSON.stringify({
      members: Array.from(this.members.entries()),
      refusals: Array.from(this.refusals.entries()),
      certifications: Array.from(this.certifications.entries()),
      gld: this.gldSupply
    });
    return crypto.createHash('sha256').update(state).digest('hex');
  }

  writeBlock(layer, block) {
    const blockPath = path.join(this.dataDir, layer, `block-${block.number}.json`);
    fs.writeFileSync(blockPath, JSON.stringify(block, null, 2));
  }

  getChainHeight(layer) {
    return layer === 'l1' ? this.l1Blocks.length - 1 : this.l2Blocks.length - 1;
  }
}

// ── Cube Agent System ──

class CubeAgent {
  constructor(id, name, vertex, role) {
    this.id = id;
    this.name = name;
    this.vertex = vertex;
    this.role = role;
    this.status = 'idle';
    this.operationSlots = [];
  }

  processTransaction(tx) {
    this.status = 'executing';
    console.log(`[Agent ${this.id}] ${this.name}: Processing ${tx.type}`);
    this.status = 'idle';
    return { success: true, agent: this.name };
  }
}

class AgentSystem {
  constructor() {
    this.agents = [
      new CubeAgent(0, 'VETTING_AGENT',       [0,0,0],       'vetting'),
      new CubeAgent(1, 'CERTIFICATION_AGENT',  [999,0,0],     'certification'),
      new CubeAgent(2, 'PUBLISHING_AGENT',     [999,999,0],   'publishing'),
      new CubeAgent(3, 'REFUSAL_AGENT',        [0,999,0],     'refusal'),
      new CubeAgent(4, 'AUDIT_AGENT',          [0,0,999],     'audit'),
      new CubeAgent(5, 'MEMBERSHIP_AGENT',     [999,0,999],   'membership'),
      new CubeAgent(6, 'RESOURCE_MANAGER',     [999,999,999], 'system'),
      new CubeAgent(7, 'ERROR_CORRECTION',     [0,999,999],   'system')
    ];
  }

  routeTransaction(tx) {
    const agentMap = {
      'file_refusal':      3,
      'resolve_refusal':   3,
      'start_vetting':     0,
      'complete_vetting':  0,
      'issue_cert':        1,
      'revoke_cert':       1,
      'publish_document':  2,
      'start_audit':       4,
      'register_member':   5,
      'award_gld':         5
    };

    const agentId = agentMap[tx.type];
    if (agentId === undefined) {
      return this.agents[6].processTransaction(tx); // Resource manager handles unknown
    }
    return this.agents[agentId].processTransaction(tx);
  }

  getStatus() {
    return this.agents.map(a => ({
      id: a.id,
      name: a.name,
      vertex: a.vertex,
      status: a.status,
      slots: a.operationSlots.length
    }));
  }
}

// ── Retaliation Detection Engine ──

class RetaliationDetector {
  constructor(chainState) {
    this.state = chainState;
    this.patterns = [];
  }

  analyze(refusalId) {
    const refusal = this.state.refusals.get(refusalId);
    if (!refusal) return { detected: false };

    const results = {
      pattern_match: this.checkPatternMatch(refusal),
      temporal_correlation: this.checkTemporalCorrelation(refusal),
      systemic_pattern: this.checkSystemicPattern(refusal)
    };

    const detected = results.pattern_match || results.temporal_correlation || results.systemic_pattern;
    return { detected, ...results };
  }

  checkPatternMatch(refusal) {
    // Check for member status changes within 90 days of filing
    const member = this.state.members.get(refusal.professional_hash);
    if (!member) return false;
    const daysSinceFiling = (Date.now() - refusal.filed_timestamp) / 86400000;
    return daysSinceFiling <= 90 && member.status_changed_after_refusal;
  }

  checkTemporalCorrelation(refusal) {
    // Check for org behavior changes after refusal
    const orgRefusals = Array.from(this.state.refusals.values())
      .filter(r => r.org_hash === refusal.org_hash);
    return orgRefusals.length > 1;
  }

  checkSystemicPattern(refusal) {
    // Multiple refusals from same org = systemic
    const orgCount = Array.from(this.state.refusals.values())
      .filter(r => r.org_hash === refusal.org_hash).length;
    return orgCount >= 3;
  }
}

// ── SLA Timer ──

class SLATimer {
  constructor(chainState) {
    this.state = chainState;
  }

  checkAll() {
    const alerts = [];
    for (const [id, refusal] of this.state.refusals) {
      if (refusal.status === 'FILED' || refusal.status === 'UNDER_REVIEW') {
        const remaining = refusal.sla_deadline - Date.now();
        const daysRemaining = remaining / 86400000;

        if (daysRemaining <= 0) {
          alerts.push({ id, type: 'BREACH', days: 0 });
        } else if (daysRemaining <= 1) {
          alerts.push({ id, type: 'CRITICAL', days: Math.ceil(daysRemaining) });
        } else if (daysRemaining <= 3) {
          alerts.push({ id, type: 'WARNING', days: Math.ceil(daysRemaining) });
        }
      }
    }
    return alerts;
  }
}

// ── Main Node ──

async function startNode() {
  const config = parseArgs();
  console.log(`[ACG-KCC] Starting ${config.type} node on port ${config.port}`);
  console.log(`[ACG-KCC] Data directory: ${config.dataDir}`);

  // Load genesis
  const genesis = JSON.parse(fs.readFileSync(config.genesisPath, 'utf8'));
  console.log(`[ACG-KCC] Chain: ${genesis.chain_name}`);
  console.log(`[ACG-KCC] Protocol: ${genesis.protocol_version}`);
  console.log(`[ACG-KCC] Parent: ${genesis.parent}`);

  // Initialize chain state
  const state = new ChainState(config.dataDir);
  state.init(genesis);

  // Initialize agent system
  const agents = new AgentSystem();
  console.log(`[ACG-KCC] ${agents.agents.length} vertex agents initialized`);
  console.log(`[ACG-KCC] ${genesis.cube_agents.total_agents} total agents available`);

  // Initialize subsystems
  const retaliationDetector = new RetaliationDetector(state);
  const slaTimer = new SLATimer(state);

  console.log(`[ACG-KCC] Retaliation detection engine online`);
  console.log(`[ACG-KCC] SLA enforcement engine online`);

  // Node info
  console.log(`\n[ACG-KCC] ═══════════════════════════════════════`);
  console.log(`[ACG-KCC]   ACG-KCC Guild Chain Node`);
  console.log(`[ACG-KCC]   Type: ${config.type}`);
  console.log(`[ACG-KCC]   L1 height: ${state.getChainHeight('l1')}`);
  console.log(`[ACG-KCC]   L2 height: ${state.getChainHeight('l2')}`);
  console.log(`[ACG-KCC]   GLD supply: ${state.gldSupply.total.toLocaleString()}`);
  console.log(`[ACG-KCC]   Agents: ${genesis.cube_agents.total_agents}`);
  console.log(`[ACG-KCC]   The spine doesn't bend.`);
  console.log(`[ACG-KCC] ═══════════════════════════════════════\n`);

  // Export for testing
  return { state, agents, retaliationDetector, slaTimer, genesis };
}

// Run if called directly
if (require.main === module) {
  startNode().catch(err => {
    console.error('[ACG-KCC] Node failed to start:', err);
    process.exit(1);
  });
}

module.exports = { startNode, ChainState, AgentSystem, RetaliationDetector, SLATimer };
