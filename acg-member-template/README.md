# ACG Member Template

Your node in the ACG-NET federated guild web.

## Setup

1. Click **"Use this template"** on GitHub to create your repo
2. Edit `manifest.json` with your handle, GitHub username, and tagline
3. Replace `assets/avatar.png` with your avatar
4. Enable GitHub Pages: **Settings > Pages > Source: main branch**
5. Submit a PR to the [ACG-NET hub](https://github.com/aicraftspeopleguild/acg-guild-hub) adding your manifest URL to `data/registry.json`
6. An existing guild member approves your PR
7. You appear on the leaderboard within the hour

## Structure

```
index.html              # Your public profile page
manifest.json           # Machine-readable identity (hub reads this)
achievements.html       # Achievement showcase
content/
  posts/                # Your blog posts (markdown)
  projects/             # Project showcases
  resources/            # Shared resources
assets/
  avatar.png            # Your avatar
  style.css             # Customizable theme
data/
  local-stats.json      # Auto-updated by GitHub Actions
  achievements.json     # Your unlocked achievements
.github/workflows/
  update-manifest.yml   # Auto-rebuilds manifest when content changes
  verify-content.yml    # Validates post format on PRs
```

See [CUSTOMIZE.md](CUSTOMIZE.md) for full customization guide.

## Protocol

This template implements **ACG-DISCOVER-v1**. The hub reads your `manifest.json` hourly. Your page is yours. The network is ours.

**No server. No database. No permission. Just git.**
