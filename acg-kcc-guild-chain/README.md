# ACG-KCC Guild Chain

Permissioned private fork of Konomi Cube Coin for AI Craftspeople Guild operations.

## Purpose

The protected ethical refusal register needs a storage layer that no single actor can tamper with, delete, or pressure into silence. A permissioned blockchain operated by guild members provides this guarantee.

## Architecture

- **Layer 1 (PoA)**: Permanent records — refusals, certifications, membership, governance
- **Layer 2 (DPoS)**: Real-time operations — vetting sessions, PackML state, activity tracking
- **Bridge**: L2 checkpoints to L1 every 50 blocks. Refusals bypass the queue.

## Contracts

| Contract | File | Purpose |
|----------|------|---------|
| EthicalRefusal | `contracts/EthicalRefusal.guildc` | Protected refusal register with SLA enforcement |
| VettingSession | `contracts/VettingSession.guildc` | ELIZA vetting with on-chain seal issuance |
| Certification | `contracts/Certification.guildc` | Organization certification lifecycle |
| Membership | `contracts/Membership.guildc` | Member registry, GLD balances, roles |

## Running a Node

```bash
# Full node (store chain, serve data)
node scripts/node.js --type=full --port=30303

# Validator node (requires 100 GLD stake)
node scripts/node.js --type=validator --port=30303

# Authority node (requires committee election)
node scripts/node.js --type=authority --port=30303
```

**Hardware**: Raspberry Pi 4 (4GB RAM), 32GB microSD, home broadband.

## Tokenomics

- **Total supply**: 510,510 GLD
- **Not a cryptocurrency**. No ICO, no exchange, no speculative value.
- GLD is governance weight, not money.

## The Point

If you refuse to build something unsafe, your refusal will be recorded, protected, and permanent. The spine doesn't bend.
