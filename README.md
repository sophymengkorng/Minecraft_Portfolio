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

## Open items from the handoff

- `cachewraith-desktop-pet` points at `https://github.com/cachewraith` rather than its own repo.
- Direction 1a (the pure shell) is not built. The handoff suggests it as a `/terminal`
  easter-egg route.
- No pixel-art avatar asset yet — only 1a used it, so nothing here is blocked on it.

## Configuration

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the canonical origin.
It is only used for Open Graph and canonical metadata. No secrets belong in this project.
