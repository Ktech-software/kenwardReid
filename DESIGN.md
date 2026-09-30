# Kenward Handyman & Remodeling: Design

> **Draft for approval.** Written from the site as it stands (September 2026) so future changes have a
> reference. Nothing here changes the site. Follow UI.md from ktech-standards; this file sets this site's direction.

## Audience
Kansas City homeowners and small landlords looking for a reliable handyman or remodeler, mostly on
phones, often comparing two or three local options. They worry about no-shows, sloppy work and
surprise costs.

## Primary job
Call Kenward for a free estimate: `tel:+18166458036`, visible without scrolling on mobile.

## Tokens
Defined once on `:root` in `index.html`.

### Color
| Token | Hex | Use |
|---|---|---|
| `--bg` | #0b0d0f | Page background |
| `--surface` / `--surface-2` / `--surface-3` | #12151a / #171b21 / #1d2229 | Raised sections, cards, controls |
| `--line` / `--line-strong` | #262c35 / #333a45 | Borders |
| `--ink` | #f2f5f8 | Body text |
| `--ink-soft` / `--ink-faint` | #a8b2bd / #7c8794 | Secondary and tertiary text |
| `--lime` | #84ff00 | Brand accent (from the logo) |
| `--cyan` / `--sky` | #64def6 / #a6d9f6 | Brand accent, focus ring (`--ring`) |
| `--on-brand` | #080a0c | Text on lime/cyan buttons |

**Dark only, by decision:** the logo's lime and cyan measure 1.3:1 and 1.6:1 against white, so they
only work on a dark base. There is no light mode (a documented deviation from UI.md §6).

### Type
- One family: the system UI stack (`--font`). No web fonts to load.
- Fluid scale: `--step--1` … `--step-4` (about 14 → 68px). Headings are heavy (800).

### Spacing, radius, shadow
- Gutter `clamp(1.25rem, 4vw, 3rem)`, section padding `clamp(4rem, 9vw, 7.5rem)`, text measure 68ch.
- Radius 14px (`--radius`) and 20px (`--radius-lg`).

## Layout concept
One long page: hero with the call button, services, a before/after slider, project photos, real
customer reviews, about, and a final call to action. Mobile menu below 64rem.

```
[logo]                       [menu] [call]
Done right the first time, no corners cut.
[ Call (816) 645-8036 ]
--- services --- before/after --- work --- reviews --- about --- contact ---
```

## Signature element
The lime-to-cyan brand gradient, used on the call button and one headline phrase.

## Voice
- Three words: direct, local, trustworthy.
- Example: "Handled start to finish by the same craftsman who answers the phone."

## Don'ts
- No stock photos: only real Kenward jobs.
- No invented reviews, numbers or badges.
- No light backgrounds behind the brand colors.
- No new wording, services, prices or photos without the client's approval.

## Known gaps
- The open mobile menu squeezes beside the logo at 375px and the phone number wraps onto three lines (seen on the live site in September 2026).
