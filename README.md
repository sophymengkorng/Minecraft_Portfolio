# cachewraith-portfolio

Personal portfolio for **Somonor Hong (CacheWraith)** — Developer × Minecraft: a
floating voxel island in three.js that turns from noon to midnight with the theme,
pixel headings over clean body type, and sections dressed as game screens (an F3
debug panel, an inventory, advancement toasts, a multiplayer server list). It began
as the pixel/CRT terminal design in [`design_handoff_cachewraith_portfolio/`](./design_handoff_cachewraith_portfolio/);
the `$ shell` eyebrows and the command bar — now Minecraft chat — survive from it.

## Stack

Next.js (App Router) · React · TypeScript · CSS Modules · `next/font/google` ·
GSAP (ScrollTrigger, SplitText, ScrambleText) · Lenis · three.js

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
│   ├── ui/               primitives (Button, Section, SectionHeader, SplitText, …)
│   ├── shared/           Navbar, CommandBar, SmoothScroll, MotionDirector, …
│   └── features/         one folder per page section
├── modules/
│   ├── portfolio/        content, types, command resolver, scroll adapter
│   ├── motion/           GSAP registration and the scroll/pointer effects
│   ├── scene/            the voxel island: world generator, pixel textures, three.js scene
│   └── theme/            day/night: the pure resolver + boot script, and the DOM half
├── config/site.ts        site metadata
├── styles/               globals.css + tokens.css
└── tests/unit/
```

## Design notes

- **All copy lives in `src/modules/portfolio/content.ts`**, including section titles and
  eyebrows (`SECTION_COPY`). Nothing is hard-coded in components.
- **Two palettes, day and night** (`tokens.css`), switched by `data-theme` on `<html>`.
  An inline boot script (`modules/theme/theme.ts`) sets it from `localStorage` or the OS
  before first paint, so there is no flash. The toggle and `/time set night` both go
  through `switchTheme`, which reveals the new theme with a view transition — one
  clip-path animated on the compositor rather than every colour transitioning.
- **Type:** Pixelify Sans for headings, labels and buttons; Geist for anything you read;
  Geist Mono for code bits. Every size is a fluid `clamp()` token.
- **Widths are one token.** `--container` is `min(100% - 2 * gutter, 1560px)`; the nav,
  every section and the footer sit on it. The sliding skill words run full-bleed outside it.
- **Smooth scroll is Lenis on GSAP's ticker** (`components/shared/SmoothScroll`), so the
  smoothed scroll and ScrollTrigger advance in the same frame. Every programmatic jump —
  nav links, the command bar, back/forward — goes through the `Scroller` adapter in
  `modules/portfolio/scroll.ts`: Lenis when it runs, native scrolling otherwise.
- **Sections stay server components.** They mark elements with `data-*` hooks and
  `components/shared/MotionDirector` applies the matching effect from
  `modules/motion/effects.ts`, gated by `gsap.matchMedia`:

  | Hook | Effect |
  |---|---|
  | `data-fill` | text starts faded and fills in, letter or word at a time, tied to scroll |
  | `data-lines` | each rendered line slides up out of a mask as it enters (SplitText) |
  | `data-scramble` | letters cycle through random glyphs and decode on enter; again on hover inside `data-scramble-row` |
  | `data-hotbar` | scrolling moves the hotbar's selected slot and pops up the item name; hover selects too |
  | `data-pop` | items pop into their slots one after another, the first time they scroll in |
  | `data-reveal` | fade up on enter, in staggered batches |
  | `data-magnetic` | leans toward the pointer |

- **Headings are split on the server** (`ui/SplitText`), one span per letter, with the
  plain string given to screen readers once. Only `data-lines` splits in the browser,
  because line breaks depend on the viewport; SplitText re-splits on resize.
- **The hero intro is CSS, not GSAP.** It plays on first paint with no hidden-until-hydrated
  state, and works without JS.
- **The voxel island** (`modules/scene/`) is generated from a seeded function
  (`world.ts`, unit-tested), textured with 16x16 canvases painted at runtime (no image
  requests) and drawn as one `InstancedMesh` per block type with buried blocks culled.
  It is loaded with a dynamic `import()`, renders on GSAP's ticker (the same frame loop
  as Lenis and ScrollTrigger), stops when off screen or in a hidden tab, and caps pixel
  ratio. The theme tweens it between noon and midnight: the sun sets, the moon rises,
  stars fade in, ores and glowstone light up. Without WebGL the CSS sky remains.
- **Skill logos** come from [Simple Icons](https://simpleicons.org) (CC0), pinned to an
  exact version and mapped in `modules/portfolio/skillIcons.ts`. They are rendered by
  server components, so the path data is in the HTML, not a client bundle. VS Code has
  no entry there (Microsoft's marks were removed), so it shows a generic `< >` glyph.
  Each logo floats like a dropped item — a CSS transform loop with a staggered phase.
- **Performance:** no `backdrop-filter`, no `mix-blend-mode` overlays and no permanent
  `will-change` — each forces work on every scrolled frame. Hover effects animate
  transform and colour only.
- **`prefers-reduced-motion: reduce`** turns off Lenis, every GSAP effect (no text is
  split) and all CSS animation; the island renders still frames, and the theme cuts instead of tweening.
- **Breakpoint is 900px**, not 760px: media queries evaluate against the layout viewport
  including the scrollbar, so 768/820/834px tablets must land on the single-column layout.
- Section links are plain `<a href="/projects">` anchors that `SectionRouter` upgrades to a
  smooth scroll plus `pushState`; each route is also statically generated, so they work
  without JS. `/` links (wordmark, back to top) scroll to the top the same way.
- Press `/` anywhere to open chat: `tp projects`, `spawn`, `time set night`.

## Verified viewports

Checked for layout and horizontal overflow at 390x844 and 1440x900, with and without
`prefers-reduced-motion`. No horizontal scroll at either.

## Open items

- `cachewraith-desktop-pet` points at its releases page rather than the repo.
- Direction 1a from the handoff (the pure shell) is not built; it could live at a
  `/terminal` easter-egg route.

## Configuration

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the canonical origin.
It is only used for Open Graph and canonical metadata. No secrets belong in this project.
