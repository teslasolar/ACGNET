# Customize Your ACG Member Page

The template gives you guild identity. Your edits give you personal identity.
The constraint is the schema (so the hub can read your manifest). Everything else is yours.

## Must Edit

- **`manifest.json`** — Set your `handle`, `github`, `joined` date, `tagline`, `avatar_url`, and `site_url`
- **`assets/avatar.png`** — Replace with your photo or icon

## Should Edit

- **`content/posts/`** — Add markdown files for blog posts (with `title`, `date`, `tags` frontmatter)
- **`content/projects/`** — Add project showcases
- **`content/resources/`** — Share tools, guides, or references

## Can Edit

- **`assets/style.css`** — Change colors, fonts, and layout via CSS custom properties
- **`index.html`** — Modify layout and sections
- **`achievements.html`** — Change how achievements are displayed

## Must NOT Edit

- `acg_protocol` field in `manifest.json` (must remain `"ACG-DISCOVER-v1"`)
- Schema structure of `manifest.json` (fields the hub reads)
- `.github/workflows/` (breaks automatic manifest updates)
- Hub communication JavaScript (the `fetch` calls to `network.json`)

## Post Format

Posts in `content/posts/` must have YAML frontmatter:

```markdown
---
title: Your Post Title
date: 2026-03-15
tags: [tag1, tag2]
---

Your post content here in markdown.
```

## How It Works

1. You push content to your repo
2. GitHub Actions automatically updates your `manifest.json`
3. The hub's hourly crawl picks up your new content
4. Your posts appear in the guild content river
5. Your stats and rank update on the leaderboard

No server. No database. No permission. Just git.

## Quick Start

```bash
# 1. Use this template on GitHub ("Use this template" button)
# 2. Clone your new repo
git clone https://github.com/YOURUSERNAME/acg-member.git
cd acg-member

# 3. Edit manifest.json with your info
# 4. Replace assets/avatar.png
# 5. Push — GitHub Pages deploys automatically

# 6. Register with the hub:
#    Submit a PR to the hub repo adding your URL to data/registry.json
```

Thomas's page should look like Thomas's page.
Alex's page should look like Alex's page.
The guild aesthetic is a shared thread, not a uniform.
