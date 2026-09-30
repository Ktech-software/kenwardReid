# kenwardReid

KTech standards (CLAUDE.md, UI.md in ktech-standards) apply. This file covers what's specific to this project.

## Overview
- **What it does:** Marketing site for Kenward Handyman & Remodeling LLC (Kansas City home repair).
- **Tier:** S
- **Status:** live
- **Domains:** www.kenwardreid.com (`CNAME`); no preview environment
- **Users:** public visitors; no accounts, no forms, no personal data collected. Contact is by `tel:`/`mailto:` links only.

## Deployable units
| Dir | Hosting | Type | Crons |
|---|---|---|---|
| `/` | GitHub Pages | Static site | none |

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
- How: GitHub Pages publishes the default branch on push. Merging to `main` is a production deploy.
- Before merging: check the page at phone width (~375px) and at desktop width.

## Rollback
- Revert the commit on `main` and push; GitHub Pages republishes within a few minutes.

## Project rules
- The repo is **public** and every file in it is served on the live domain. Never commit credentials, customer data or internal notes here (those go in ktech-standards).
- Keep file names exactly as they are; the page references them by exact name and case (`.JPEG` vs `.jpg` matters on GitHub Pages).
- The schema.org structured data in `index.html` must match the visible business name, phone and URL; update both together.

## Known issues
1. `README.md` is a placeholder.

## Deviations from KTech standards
- Hosted on GitHub Pages instead of Cloudflare Pages. Works fine for a static page; move only if it needs Cloudflare features.
