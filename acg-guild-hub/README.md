# ACG Guild Hub

The discovery portal for the ACG-NET federated member network.

## What It Does

The hub is a **router**, not a server. It discovers member-owned GitHub Pages sites, aggregates their manifests, and presents a unified view of the Guild network: leaderboard, content river, achievement showcase, and network stats.

## How It Works

1. Members register by submitting a PR adding their manifest URL to `data/registry.json`
2. GitHub Actions runs the discovery script hourly (`scripts/discover.js`)
3. The script fetches each member's `manifest.json` via HTTPS GET
4. Validates the ACG-DISCOVER-v1 schema, computes rankings and brain tiers
5. Writes aggregated state to `data/network.json`
6. GitHub Pages redeploys with fresh data

## Files

| File | Purpose |
|------|---------|
| `index.html` | Hub portal with leaderboard, content river, achievements |
| `data/registry.json` | List of registered member manifest URLs |
| `data/network.json` | Aggregated network state (rebuilt hourly) |
| `scripts/discover.js` | Node.js discovery script |
| `.github/workflows/discover.yml` | Hourly cron job |
| `.github/workflows/on-pr-merge.yml` | New member registration handler |

## Protocol

**ACG-DISCOVER-v1**: Members publish `manifest.json` at a known URL. The hub fetches all registered manifests, aggregates them into `network.json`, and rebuilds. Member sites fetch `network.json` for their rank and network stats.

No servers. No databases. Just static files and HTTPS GETs.
