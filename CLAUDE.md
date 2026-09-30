# kenwardReid

KTech standards (CLAUDE.md, UI.md in ktech-standards) apply. This file covers what's specific to this project.

## Overview
- **What it does:** Marketing site for Kenward Handyman & Remodeling LLC (Kansas City home repair).
- **Tier:** S
- **Status:** live
- **Domains:** www.kenwardreid.com; every branch/PR also gets a Cloudflare Pages preview URL (linked from the PR's "Cloudflare Pages" check)
- **Users:** public visitors; no accounts, no forms, no personal data collected. Contact is by `tel:`/`mailto:` links only.

## Deployable units
| Dir | Hosting | Type | Crons |
|---|---|---|---|
| `/` | Cloudflare Pages project `kenwardreid` (Git integration) | Static site | none |

- One page: `index.html` holds all markup, CSS and the small inline JS (nav menu toggle, footer year). No build step, no package manager, no tests.
- Images sit at the repo root (`logo.png`, `favicon.png`, `apple-touch-icon.png`, `before*/after*.JPEG`, `project*.jpg`, `Handyman.jpg`).
- Page sections (anchor ids): `top` (hero), `services`, `transformations` (before/after), `work`, `reviews`, `about`, `contact`.

## Bindings / Secrets
None.

## Commands
```
python3 -m http.server 8000   # preview at http://localhost:8000
```

## Deploy
- How: Cloudflare Pages Git integration. Merging to `main` is a production deploy; other branches deploy to preview URLs.
- Before merging: open the PR's preview URL and check the page at phone width (~375px) and at desktop width.

## Rollback
- Pages: Cloudflare dashboard → Workers & Pages → `kenwardreid` → Deployments → Rollback.
- Or revert the commit on `main` and push.

## Project rules
- The repo is **public** and every file in it is served on the live domain. Never commit credentials, customer data or internal notes here (those go in ktech-standards).
- Keep file names exactly as they are; the page references them by exact name and case (`.JPEG` vs `.jpg` matters once deployed).
- The schema.org structured data in `index.html` must match the visible business name, phone and URL; update both together.

## Known issues
1. `README.md` is a placeholder.
2. The `CNAME` file is left over from GitHub Pages hosting. Confirm GitHub Pages is switched off (repo Settings → Pages), then it can be deleted.

## Deviations from KTech standards
- None.
