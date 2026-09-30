# kenwardReid

Part of the **KTech Software Solution** portfolio (sibling projects: CricketAuction,
VisabulletinTracker, KTechSoftwareSolution). Repo: `Ktech-software/kenwardReid`.

## What this is

Marketing site for **Kenward Handyman & Remodeling LLC** (Kansas City home repair),
served at https://www.kenwardreid.com via GitHub Pages (`CNAME` → `WWW.KENWARDREID.COM`).

- Single static page: `index.html` holds all markup, CSS and the small inline JS
  (nav menu toggle, footer year). No build step, no package manager, no tests.
- Images live at the repo root (`logo.png`, `favicon.png`, `apple-touch-icon.png`,
  `before*/after*.JPEG`, `project*.jpg`, `Handyman.jpg`).
- Page sections (anchor ids): `top` (hero), `services`, `transformations`
  (before/after), `work`, `reviews`, `about`, `contact`.
- Includes schema.org structured data; keep it in sync with the visible
  business name, phone and URL when those change.

## Working on it

- Preview locally: `python3 -m http.server 8000` in the repo root, open
  http://localhost:8000.
- Anything merged to `main` goes live on the public site — check the page at
  phone width (~375px) and desktop before merging.
- Keep file names as they are; the page references them by exact name and case
  (`.JPEG` vs `.jpg` matters on GitHub Pages).
- This repo is **public** and every file in it is served on the live domain:
  never commit credentials, customer data or internal notes here.
