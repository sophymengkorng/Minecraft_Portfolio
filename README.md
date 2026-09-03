# cachewraith-portfolio

Personal portfolio for **Somonor Hong (CacheWraith)** — pixel-art / CRT terminal aesthetic,
built from the handoff in [`design_handoff_cachewraith_portfolio/`](./design_handoff_cachewraith_portfolio/).

This implements **direction 1b** (hybrid): a scrollable pixel-styled page with a persistent
`cd ›` command bar pinned at the bottom.

## Stack

Next.js (App Router) · React · TypeScript · CSS Modules · `next/font/google`

## Commands

```bash
npm run dev        # dev server on :3000
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm test           # vitest
```

## Layout

```
src/
├── app/                  routes and error boundaries only
├── components/
│   ├── ui/               dumb primitives (Kicker, Pill, PixelButton, Section, …)
│   ├── shared/           WindowFrame, Titlebar, CommandBar
│   └── features/         one folder per page section
├── modules/portfolio/    content constants, types, command resolver
├── config/site.ts        site metadata
├── styles/               globals.css + tokens.css
└── tests/unit/
```

## Design notes

- **All copy lives in `src/modules/portfolio/content.ts`.** Edit projects, skills and links
  there; nothing is hard-coded in components.
- **Border radius is 0 everywhere** — enforced by `--radius` in `tokens.css`. Non-negotiable
  for the aesthetic.
- **Every section fills the screen.** `--section-min-height` is
  `100svh - titlebar - command bar`, and each section centers its content in that
  space. Sections with more content than that (projects on a phone) simply grow.
- **About and Skills carry a larger scale.** Both bands hold little content, so
  at full-screen height the authored 14.5px/10px type disappeared in them (they
  measured 81% and 87% empty). Only the *size* is scaled up (`--fs-meta`,
  `--fs-group`, `--fs-pill-lg`); the prototype's treatment is kept intact — the
  About bio stays body copy at 1.9 line-height on a 58ch measure, the key/value
  rules stay dashed with no panel, and the skills grid stays 2x2. Rows are
  distributed `space-evenly` down the band.
- **Silkscreen everywhere.** Both `--font-display` and `--font-body` are
  Silkscreen-first. JetBrains Mono stays in the stack (and stays loaded) purely
  as a per-glyph fallback — Silkscreen has no glyph for the design's arrows,
  block and chevron (`↗ ▮ ›`), and the browser substitutes for those characters
  alone rather than the whole run. This departs from the handoff, which set body
  copy in JetBrains Mono.
- **Chrome bar heights are set explicitly** from `--titlebar-height` /
  `--commandbar-height` rather than falling out of padding plus a fluid font.
  The section height and anchor offsets are derived from those tokens, so they
  have to be exact at every width; 56px desktop, 46px at/below 900px.
- **All type is fluid.** `tokens.css` defines the scale as `slope*vw + basepx`
  ramps that land exactly on the handoff's authored sizes at ~1440px, hold a
  readable floor on phones, and grow ~14% on large desktop/5K. No component
  hard-codes a `font-size` in px.
- **Breakpoint is 900px**, not 760px: media queries evaluate against the layout
  viewport including the scrollbar, so a 768px iPad reports 768 (not its 753px
  client width) and would otherwise fall through to the desktop two-column
  layout. 900px covers 768/820/834 tablets.
- **Widths are two tokens in `tokens.css`.** The frame is full-bleed (`--frame-width: 100%`),
  so backgrounds and section rules run edge to edge; content sits on a shared 80% measure
  (`--content-width`) via `components/ui/Container`. The titlebar, every section and the
  command bar all use that same container, so they line up on identical left/right rails.
  Below 760px `--content-width` drops to 100% with 20px side padding.
- Colors are authored in `oklch` and kept as-is; the wide-gamut cyan/magenta is part of the look.
- `-webkit-font-smoothing: none` on `body` — antialiasing softens the bitmap font.
- Only `CommandBar` is a client component. Nav links and hero buttons are plain anchors driven
  by `scroll-behavior: smooth` plus `scroll-margin-top` on each section.
- `prefers-reduced-motion: reduce` freezes the cursor blink and jump animation; the static
  scanlines stay.

## Verified viewports

Checked for layout, overflow, and type scale at 320x700, 360x740, 390x844,
768x1024, 834x1112, 1024x768, 1440x900, 1920x1080 and 2560x1440. No horizontal
scroll at any width.

320px needs its own breakpoint (`max-width: 400px`): Silkscreen is far wider than
a normal mono face, so the four nav labels plus the status lights overflow the
rail there. That breakpoint shrinks the lights, the nav gap, `--fs-nav` and the
container padding.

## Open items from the handoff

- `cachewraith-desktop-pet` points at `https://github.com/cachewraith` rather than its own repo.
- Direction 1a (the pure shell) is not built. The handoff suggests it as a `/terminal`
  easter-egg route.
- No pixel-art avatar asset yet — only 1a used it, so nothing here is blocked on it.

## Configuration

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the canonical origin.
It is only used for Open Graph and canonical metadata. No secrets belong in this project.
