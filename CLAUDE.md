# kenwardReid

KTech standards (CLAUDE.md, UI.md in ktech-standards) apply. This file covers what's specific to this project.

## KTech core rules (always apply, even when ktech-standards isn't loaded)
- Full standards: `ktech-standards` repo (CLAUDE.md, UI.md). In a cloud session, attach that repo too; if it isn't available, say so before any non-trivial work.
- Never commit to `main`; branch (`feat/ fix/ chore/ docs/ test/ refactor/ security/ spike/`), open a PR, merge after CI is green.
- Never open or print `.dev.vars`, `.env` or key files; check names only. Secrets live in Bitwarden and are set with `wrangler secret put`.
- Get the owner's explicit OK before: production deploys, remote D1/KV/R2 writes, secret changes, creating/deleting Cloudflare resources or DNS, force-push/history rewrites/branch deletion, `rm -rf`, dependency changes, anything that emails, charges or contacts real users.
- Done means: typecheck, lint and tests run and pass (report real results), security checklist checked, docs updated, work pushed on a branch.
- `.claude/settings.json` + `.claude/hooks/ktech-guard.mjs` enforce parts of this; don't edit or bypass them.

## Overview
- **What it does:** Marketing site for Kenward Handyman & Remodeling LLC (Kansas City home repair).
- **Tier:** S
- **Status:** live
- **Domains:** www.kenwardreid.com (canonical) and kenwardreid.com, both attached as custom domains on the Cloudflare Pages project (Workers & Pages → kenwardreid → Custom domains). Every branch/PR also gets a Cloudflare Pages preview URL (linked from the PR's "Cloudflare Pages" check).
- **Users:** public visitors; no accounts, no forms, no personal data collected. Contact is by `tel:`/`mailto:` links only.

## Deployable units
| Dir | Hosting | Type | Crons |
|---|---|---|---|
| `/` | Cloudflare Pages project `kenwardreid` (Git integration) | Static site | none |

- One page: `index.html` holds all markup and CSS; `js/site.js` holds the behaviour (nav menu toggle, before/after slider, footer year). No inline scripts: the CSP in `_headers` allows `script-src 'self'` only. No build step, no package manager.
- `_headers` (security headers, noindex on pages.dev), `robots.txt`, `sitemap.xml`, `site.webmanifest`. Bump `<lastmod>` in `sitemap.xml` when page content changes.
- Images sit at the repo root (`logo.png`, `favicon.png`, `apple-touch-icon.png`, `before*/after*.JPEG`, `project*.jpg`, `Handyman.jpg`).
- Page sections (anchor ids): `top` (hero), `services`, `transformations` (before/after), `work`, `reviews`, `about`, `contact`.

## Bindings / Secrets
None.

## Commands
```
python3 -m http.server 8000                       # preview at http://localhost:8000
npx --yes html-validate@9 "**/*.html"             # what CI runs (config: .htmlvalidate.json)
npx --yes linkinator@6 . --recurse --skip "^(?!http://localhost)"
```
CI (`.github/workflows/ci.yml`): gitleaks secret scan, HTML validation, local link check. `main-guard.yml` alerts if anything lands on `main` without a PR.

## Deploy
- How: Cloudflare Pages Git integration. Merging to `main` is a production deploy; other branches deploy to preview URLs.
- Before merging: open the PR's preview URL and check the page at phone width (~375px) and at desktop width. `_headers` (CSP) only applies on Cloudflare, so check the browser console on the preview.
- Content changes (wording, services, prices, photos) need the client's approval.

## Rollback
- If a hostname stops resolving, check Custom domains first: both `www.kenwardreid.com` and `kenwardreid.com` must be listed and Active (see the 2026-09-30 incident note in ktech-standards).
- Pages: Cloudflare dashboard → Workers & Pages → `kenwardreid` → Deployments → Rollback.
- Or revert the commit on `main` and push.

## Project rules
- The repo is **public** and every file in it is served on the live domain. Never commit credentials, customer data or internal notes here (those go in ktech-standards).
- Keep file names exactly as they are; the page references them by exact name and case (`.JPEG` vs `.jpg` matters once deployed).
- The schema.org structured data in `index.html` must match the visible business name, phone and URL; update both together.

## Known issues
1. The open mobile menu squeezes beside the logo at 375px and the phone number wraps onto three lines (pre-existing; see DESIGN.md).
2. The repo is public while KTech repos default to private; the owner decides whether to make it private (Cloudflare Pages works either way).
3. Both hostnames serve the same page; the canonical tag points to www. A Cloudflare redirect from kenwardreid.com to www is optional.

## Deviations from KTech standards
- Dark mode only (UI.md §6): the brand colors fail contrast on light backgrounds. Recorded in DESIGN.md.
