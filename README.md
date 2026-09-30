# kenwardreid.com

Marketing site for **Kenward Handyman & Remodeling LLC** (Kansas City home repair), built and run by
KTech Software Solutions. Live at https://www.kenwardreid.com.

## What's here
- `index.html`: the whole page (markup and CSS).
- `js/site.js`: mobile menu, before/after slider, footer year.
- Images at the repo root. File names and case are referenced exactly from `index.html`.
- `_headers`: security headers applied by Cloudflare Pages.
- `robots.txt`, `sitemap.xml`, `site.webmanifest`: search and browser metadata.

No build step, no dependencies.

## Run it locally
```
python3 -m http.server 8000
```
Open http://localhost:8000. (`_headers` only applies on Cloudflare, so check CSP issues on the PR preview.)

## Change it
1. Create a branch, make the change, open a pull request.
2. CI runs a secret scan, HTML validation and a link check.
3. Cloudflare Pages posts a preview URL on the PR. Check it at phone and desktop widths.
4. Merge to `main`. Cloudflare deploys it to production.

Wording, services, prices and photos need the client's approval before merging.

Project rules for Claude Code are in `CLAUDE.md`; design direction is in `DESIGN.md`.
