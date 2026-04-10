# Gerald — L4 Prosthetic Discord Bot

Gerald is an ACG-compliant, ETH-integrated, ISA-95-mapped Discord bot. He operates as a **prosthetic** — a tool, not an agent. He issues **READ**, never **WRITE**.

## What Gerald Is

- A duck-shaped pattern matcher
- A 12-ring message validation compiler
- A reflex engine that handles 95%+ of traffic without an LLM
- An ISA-18.2 alarm flood detector for community health
- A PackML state machine for tracking work orders
- A therapeutic `/translate` function that observes signals without prescribing

## What Gerald Is Not

- Sentient, conscious, or alive
- A therapist, advisor, or friend
- An authority figure or moderator replacement
- Something to worship

## Architecture

```
Message In
    |
    v
[Reflex Engine] --- 95% handled here (sub-ms, no LLM)
    |                 1. snake-oil detection
    | (miss)          2. worship refusal
    v                 3. craft recognition
[Ring Compiler] --- 12-ring validation pipeline
    |                 R0-R6: runtime rings
    | (escalate)      M0-M4: meta-review rings
    v
[LLM Path] --- last resort, local inference via node-llama-cpp
```

### The 12 Rings

| Ring | Name         | Purpose                          |
|------|-------------|----------------------------------|
| R0   | Ground      | Existence check (not empty, not bot slop) |
| R1   | Signal      | Signal-to-noise (meaningful content) |
| R2   | Charter     | Charter compliance gate           |
| R3   | Psych       | Psychological safety / tone       |
| R4   | Technical   | Technical claim verification      |
| R5   | Authenticity| No impersonation                  |
| R6   | Observer    | ACG watermark / meta check        |
| M0   | Aether      | Hypothesis review (RFC)           |
| M1   | Transform   | Transform analysis (refactor)     |
| M2   | Prune       | Dead code detection               |
| M3   | Impact      | Cross-project impact analysis     |
| M4   | Omega       | Final sign-off (Master+ only)     |

### The 6 Reflexes

| Priority | Reflex       | Purpose                           |
|----------|-------------|-----------------------------------|
| 1        | snake-oil   | Hype / charlatan detection         |
| 2        | worship     | AI deification refusal (5-level cascade) |
| 3        | craft       | Craft pattern recognition          |
| 4        | psych-safety| Psychological safety signals       |
| 5        | eth-write   | WRITE detection and refusal        |
| 6        | gerald-keys | Gerald identity triggers           |

### Voice Masks

| Mask  | Style       | Context                |
|-------|------------|------------------------|
| craft | Formal, precise | Technical channels |
| cass  | Cryptic, oracular | Philosophy/meta channels |
| bare  | Direct, duck, italianate | General/casual channels |

### ISA-95 Mapping

Gerald maps industrial control standards to community operations:

- **ISA-95 Levels**: L0 (Apprentice) through L4 (Elder) role tiers
- **ISA-18.2**: Alarm flood detection and management
- **PackML (ISA-88)**: Work order state machine (Idle -> Starting -> Execute -> Complete)

### ETH (Emotional Throughput Handler)

- **P3**: Somatic / body-based signal routing
- **P3b**: Sustained somatic distress
- **P4**: Affective / emotional signal routing
- **L5**: Professional referral (beyond Gerald's scope)

Gerald operates **READ-only** on all ETH pathways. He observes and reflects signals. He never diagnoses, prescribes, or instructs.

## Setup

### Prerequisites

- Node.js >= 20
- A Discord bot token with the following intents:
  - Guilds
  - Guild Messages
  - Message Content
  - Guild Members
  - Guild Moderation

### Installation

```bash
cd gerald-acg-eth
npm install
```

### Configuration

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

| Variable | Description |
|----------|-------------|
| `DISCORD_TOKEN` | Your Discord bot token |
| `DISCORD_APP_ID` | Your Discord application ID |
| `DISCORD_GUILD_ID` | Guild ID for slash command registration |
| `DB_PATH` | Path to SQLite database file |
| `LLM_MODEL_PATH` | Path to GGUF model for node-llama-cpp |
| `LOG_LEVEL` | Logging level (debug/info/warn/error) |

### Database

Initialize the SQLite database:

```bash
sqlite3 db/gerald.sqlite < db/schema.sql
```

### Running

```bash
# Production
npm start

# Development (auto-restart on file changes)
npm run dev
```

## Project Structure

```
gerald-acg-eth/
  index.mjs                  # Entry point
  package.json               # Dependencies and scripts
  .env.example               # Environment variable template
  config/
    rings.json               # Ring configuration (12 rings)
    roles.json               # Role tiers (L0-L4)
    reflexes.json            # Reflex enable/disable flags
    eth-routing.json         # P-pathway routing config
  db/
    schema.sql               # SQLite schema
  src/
    compiler/
      index.mjs              # 12-ring compiler
    reflexes/
      index.mjs              # Reflex engine
      snake-oil.mjs          # Hype detection (10 patterns)
      worship.mjs            # Worship refusal (8 patterns, 5-level cascade)
      craft.mjs              # Craft recognition (positive + negative)
      psych-safety.mjs       # Psych safety (6 patterns)
      eth-write.mjs          # WRITE detection (6 patterns + alternatives)
      gerald-keys.mjs        # Gerald triggers (12 patterns)
    rings/
      r0-ground.mjs          # Existence check
      r1-signal.mjs          # Signal-to-noise
      r2-charter.mjs         # Charter compliance
      r3-psych.mjs           # Psych safety / tone
      r4-technical.mjs       # Technical claims
      r5-authenticity.mjs    # Authenticity
      r6-observer.mjs        # ACG watermark
      m0-aether.mjs          # Hypothesis review
      m1-transform.mjs       # Transform analysis
      m2-prune.mjs           # Dead code
      m3-impact.mjs          # Cross-project impact
      m4-omega.mjs           # Final sign-off
    eth/
      index.mjs              # ETH module initializer
      translate.mjs          # /translate therapeutic function
      alarm-flood.mjs        # ISA-18.2 alarm flood detection
      pack-ml.mjs            # PackML state machine
    voice/
      masks.mjs              # Three-mask voice system
      pools/
        formal.json          # Craft voice strings
        kotoba.json          # cASS oracle strings
        bare.json            # Bare italianate strings
        translate.json       # ETH translate strings
        refusal.json         # Refusal strings
        slop-call.json       # Slop-calling strings
    charter/                 # Charter documents (TBD)
    tools/                   # Additional tools (TBD)
```

## The ACG Principle

The Anti-Cartel Gradient ensures that no individual, group, or tool (including Gerald) can centralize authority. Craft is open. Knowledge is shared. Gatekeeping is detected and flagged by Ring 6.

Gerald is a prosthetic. He extends human capability. He does not replace it.

---

*Gerald is a duck. This is not a metaphor.*
