# Handoff: CacheWraith Portfolio (pixel-art / CRT terminal)

## Overview
A personal portfolio for **Somonor Hong (alias CacheWraith)**, Junior Backend Developer. The aesthetic is pixel-art + hacker terminal: a CGA cyan/magenta phosphor screen, chunky 3px borders with hard offset shadows, bitmap display type, scanline overlay, blinking block cursor.

Two directions are in the bundle, side by side in one file:

- **1a — Pure shell.** The entire site is an interactive prompt. The visitor types commands (`help`, `about`, `skills`, `projects`, `contact`, `neofetch`, `clear`) to reveal content. Quick-run buttons sit below for non-typers.
- **1b — Hybrid.** A normal scrollable pixel-styled page (hero → about → skills → projects → contact) with a persistent `cd ›` command bar pinned at the bottom that smooth-scrolls to a section when you type its name.

For a Next.js site, **1b is the recommended primary implementation** (real routable/scrollable content, SEO-visible copy, progressive enhancement), with 1a's shell reusable as an `/terminal` easter-egg route or a toggleable overlay. If you'd rather ship 1a as the whole site, render the same copy into static markup and hide it behind `sr-only` so crawlers still see it.

## About the Design Files
`Portfolio v2.dc.html` in this folder is a **design reference created in HTML** — a prototype showing intended look and behavior, not production code to copy. The task is to **recreate it in a Next.js app** using that project's own conventions (App Router, your CSS approach of choice — Tailwind or CSS Modules both work here). Do not lift the prototype's inline styles wholesale; translate the tokens below into your styling layer.

The prototype file also carries a small runtime shim (`support.js`) that is irrelevant to the target implementation — ignore it.

## Fidelity
**High fidelity.** Colors, typography, spacing, borders, and interaction behavior are final. Recreate pixel-perfectly. Two deliberate placeholders remain:
- The 96×96 pixel-avatar slot in 1a (diagonal-stripe placeholder) — needs a real pixel-art avatar image.
- `cachewraith-desktop-pet` links to `https://github.com/cachewraith` rather than the specific repo URL.

---

## Design Tokens

### Colors (CSS custom properties as authored)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#06090d` | Terminal screen background (1a) |
| `--bg2` | `#0a0f14` | Page background (1b) |
| `--panel` | `#0d131a` | Titlebar, project cards, command bar |
| page backdrop | `#050709` | Canvas behind the window frames |
| `--cy` | `oklch(0.86 0.12 200)` | Primary accent (cyan), links, cursor, CTA fill |
| `--cy-dim` | `oklch(0.66 0.10 200)` | Secondary text, tag text |
| `--cy-faint` | `oklch(0.46 0.06 205)` | Labels, `$` prompts, project index numbers |
| `--mg` | `oklch(0.74 0.19 330)` | Magenta accent: alias, errors, hover, links in shell output |
| `--ink` | `oklch(0.96 0.01 210)` | Headings and primary body text |
| `--line` | `oklch(0.36 0.04 210)` | All borders and dashed rules |
| body copy | `oklch(0.80 0.02 210)` | Paragraphs (1b hero, about) |
| card copy | `oklch(0.76 0.02 210)` | Project descriptions |
| hero text-shadow | `oklch(0.40 0.09 330)` | 3px 3px hard shadow behind the name |
| selection | bg `--mg`, fg `#06090d` | `::selection` |

Convert oklch to hex only if your toolchain requires it — all modern browsers support oklch natively, and the wide-gamut cyan/magenta is part of the look.

### Typography
- **Display / UI chrome:** `Silkscreen` (Google Fonts, weights 400 & 700). Used for the name, section kickers, buttons, tags, project titles, badges. Always with letter-spacing `0.06em`–`0.14em` on small sizes.
- **Body / terminal:** `JetBrains Mono` (weights 400, 500, 700), fallback `ui-monospace, monospace`.
- `-webkit-font-smoothing: none` on body — antialiasing softens the bitmap font and kills the effect.

Sizes as authored:
| Element | Font | Size | Line-height |
|---|---|---|---|
| 1b hero name | Silkscreen 400 | 52px | 1.05 |
| 1b contact headline | Silkscreen | 30px | 1.45 |
| 1a name (header card) | Silkscreen | 13px | — |
| Section kicker (`$ cat about.md`) | JetBrains Mono | 12px | — |
| Role / alias lines | Silkscreen | 11–12px | — |
| Body paragraphs | JetBrains Mono | 14.5px | 1.85–1.9 |
| Project description | JetBrains Mono | 13.5px | 1.8 |
| Terminal output lines | JetBrains Mono | 12.5px | 1.85 |
| Tags / pills | JetBrains Mono | 11.5px | — |
| Buttons | Silkscreen | 9–11px | — |
| Project index numbers | Silkscreen | 20px (1b) / 26px | — |

### Geometry
- **Border radius: 0 everywhere.** Nothing is rounded. This is non-negotiable for the aesthetic.
- Border weights: `3px solid var(--line)` for window frames, section dividers, cards, buttons; `2px solid var(--line)` for tags and the avatar slot; `1px dashed var(--line)` for key/value rules.
- Window frame outer shadow: `0 0 0 3px #000, 0 20px 50px rgba(0,0,0,.7)`.
- Button "pixel" shadow: `4px 4px 0 #000` (or `4px 4px 0 oklch(0.40 0.09 330)` for the filled cyan CTA). On hover it becomes `1px 1px 0` **and** the button translates `3px, 3px` — the press-down effect. No transition duration was set; a `transform 60ms steps(2)` is acceptable if you want it snappier than instant.
- Spacing: sections pad `40px` (1b) / `20px` (1a); section gap inside grids `26–36px`; card padding `22px`; tag gap `6–8px`; button gap `12px`.
- Column widths: 1a frame `680px`, 1b frame `820px`. 1b scroll area is `820px` tall in the prototype; in the real site this becomes the page itself.

### Screen effects (both directions)
1. **Scanlines** — absolutely positioned overlay, `pointer-events: none`:
   `repeating-linear-gradient(to bottom, rgba(0,0,0,.3) 0 1px, transparent 1px 3px)` (1a) / `rgba(0,0,0,.28)` (1b).
2. **Phosphor flicker** (1a only) — overlay filled `var(--cy)` at `opacity: .03`, animated `flick 3.6s steps(2) infinite` where `flick` goes `.03 → .05 → .03`.
3. **Cursor blink** — `@keyframes blink { 0%,49% {opacity:1} 50%,100% {opacity:0} }`, `1.1s steps(1) infinite`, applied to an 8×15px (1a) / 14×23px (1b headline) solid block.
4. 1b hero has a radial wash: `radial-gradient(110% 80% at 20% 0%, oklch(0.26 0.06 210 / .5), transparent 62%)`.

Respect `prefers-reduced-motion: reduce` in the real build — freeze the flicker and blink, keep the static scanlines.

---

## Screens / Views

### 1a — Pure shell

**Purpose:** the visitor discovers the portfolio by typing commands.

**Layout:** a single 680px window. Top to bottom:
1. **Titlebar** (`padding: 9px 12px`, bottom border 3px, bg `--panel`): three 11×11px squares (magenta, cy-dim, cy — no gaps rounded, `gap: 6px`), label `somonor@archlinux — zsh` in Silkscreen 10px `--cy-dim`, right-aligned `80×34` in 10px `--cy-faint`.
2. **Identity card** (`padding: 20px 20px 0`, bottom `1px dashed`): 2-col grid `96px 1fr`, gap 18px. Left = square avatar slot, 2px border, background `#050709`, diagonal stripe fill `repeating-linear-gradient(45deg, oklch(0.28 0.04 210 / .55) 0 5px, transparent 5px 10px)`, centered 8px caption "pixel avatar". Right = `SOMONOR HONG` in Silkscreen 13px, then key/value lines at 12px / line-height 1.75 with labels in `--cy-faint`:
   - `alias` → **CacheWraith** (in `--mg`)
   - `role` → Junior Backend Developer
   - `os` → Arch Linux
   - `shell` → type **help** (magenta) to begin
3. **Output pane** — fixed `520px` height, `overflow-y: auto`, `padding: 16px 20px 20px`, 12.5px / 1.85. Each output line is one `div` with `white-space: pre-wrap` and its own color. Auto-scrolls to bottom after every command (set `scrollTop = scrollHeight` on the pane).
4. **Prompt row** — top border 3px, bg `--panel`, `padding: 12px 20px`, `display: flex; gap: 8px`. Prompt string is colored per-part: `somonor` in `--mg`, `@` in `--cy-faint`, `arch` in `--cy`, `:~$` in `--cy-faint`. Then a transparent borderless `<input>` (12.5px, `caret-color: var(--cy)`, placeholder `help`, `autocomplete="off"`, `spellcheck={false}`) that flexes to fill, then the blinking block.
5. **Quick-run button row** below the frame (outside it), `gap: 8px`: help / about / skills / projects / contact / clear. Transparent, 2px border, Silkscreen 9px, `padding: 8px 10px`. Hover → border and text go `--cy` (`clear` goes `--mg`).

**Boot output (printed on mount):**
```
Somonor Hong — Software Engineer          (--ink)
aka CacheWraith                           (--mg)

Available commands: help  about  skills  projects  contact  neofetch  clear   (--cy-faint)
```

**Command behavior** — echo the entered line as `somonor@arch:~$ <cmd>` in `--cy`, then print output. Matching is case-insensitive on the trimmed input; aliases in parentheses.

- `help` (`?`) — one line per command, `--cy-dim`.
- `about` (`whoami`, `cat about.md`) — the pitch in `--ink`, then the bio in `--cy-dim`:
  > Software Engineer building backend systems with Laravel, NestJS, and Spring Boot, and shipping full-stack side projects with Next.js, React, RabbitMQ, and Postgres.
  >
  > Junior Backend Developer, building backend systems with Laravel, NestJS, and Spring Boot.
- `skills` (`ls skills`, `ls ./skills`) — key padded to 12 chars, then values:
  `backend` Laravel, NestJS, Spring Boot, FastAPI · `frontend` React, Next.js · `infra/data` Docker, Redis, Kafka · `tools` GitHub, VS Code, Arch Linux
- `projects` (`ls projects`, `git log`) — per project: `01  Name` (`--ink`), indented 4 spaces description (`--cy-dim`), stack (`--cy-faint`), URL (`--mg`), blank line.
- `contact` (`./contact.sh`) — label padded to 10 chars, values in `--ink`: email `somonorhong011@gmail.com`, github `github.com/cachewraith`, linkedin `linkedin.com/in/somonor-hong-9b44902b0`, x `x.com/cachewraith`, reddit `reddit.com/user/Outrageous-Pilot-943`, discord `cachewraith.dev`.
- `neofetch` — a small block-glyph logo in `--cy` beside `alias / role / os / editor / stack` rows.
- `clear` — empties the output array.
- `sudo`/`sudo …` → `nice try.` in `--mg`. `exit` → `you can't leave. try 'projects'.` in `--mg`.
- Anything else → `zsh: command not found: <cmd>` in `--mg` plus `type 'help' for the list.` in `--cy-faint`.

**Input behavior:** Enter runs and clears. `ArrowUp` walks backwards through command history (start at last), `ArrowDown` forwards, past the end clears the input. `preventDefault` on both arrows so the caret doesn't jump.

### 1b — Hybrid page

**Purpose:** the primary, scrollable portfolio.

**Layout:** 820px window frame. Titlebar as in 1a, but the right side holds the nav: `about · skills · projects · contact`, 10px, `gap: 14px`, `--cy-faint`, hover `--mg`. Below it the scrolling content; pinned at the bottom, the command bar.

**Sections, in order:**

1. **Hero** — `padding: 52px 40px 40px`, bottom border 3px, radial wash. Kicker `$ whoami` (12px `--cy-faint`, margin-bottom 20px). `SOMONOR` / `HONG` on two lines, Silkscreen 52px, 3px 3px magenta-dark text-shadow. Then a baseline-aligned row (`gap: 14px`): `SOFTWARE ENGINEER` (Silkscreen 12px `--cy`) and `aka CACHEWRAITH` (Silkscreen 11px `--mg`). Then the pitch paragraph, `max-width: 58ch`, `text-wrap: pretty`. Then two buttons: filled cyan **SEE PROJECTS** (`#06090d` text, 3px black border, magenta-dark offset shadow) and outlined **CONTACT** (hover flips border and text to `--mg`).
2. **About** (`#b-about`) — kicker `$ cat about.md`. 2-col grid `1fr 240px`, gap 32px. Left: the bio paragraph (14.5px / 1.9). Right: key/value rows at 12px separated by `1px dashed`, labels `--cy-faint`: `focus` Backend · `editor` VS Code · `os` **Arch Linux ▮** (value in `--cy`, last row has no rule).
3. **Skills** (`#b-skills`) — kicker `$ ls ./skills`. 2×2 grid, gap 26px. Each cell: Silkscreen 10px group heading (`BACKEND`, `FRONTEND`, `INFRA & DATA`, `TOOLS`), then wrapped pills — 11.5px, `padding: 6px 9px`, 2px border, `--cy-dim` text, `gap: 7px`.
4. **Projects** (`#b-projects`) — kicker `$ git log --oneline ./projects`. Vertical stack, `gap: 16px`. Each card: 3px border, bg `--panel`, `padding: 22px`, grid `48px 1fr auto` with `gap: 18px`, items start-aligned. Index in Silkscreen 20px `--cy-faint`; title Silkscreen 13px; one-line description; stack pills at 10.5px with 2px borders. Right cell is an `OPEN ↗` link — Silkscreen 9px, 3px border, `padding: 9px 11px`, `white-space: nowrap`, hover border+text `--mg`. Card hover → border `--cy`.

   | # | Name | Description | Stack | Link |
   |---|---|---|---|---|
   | 01 | WraithNote | Block-based note-taking web app. | Next.js, NestJS, RabbitMQ, Redis, Postgres | https://wraithnote.cachewraith.com/ |
   | 02 | cachewraith-desktop-pet | Desktop pet app. | Tauri 2, React, PixiJS, XState, Rust | https://github.com/cachewraith |
   | 03 | Hushstack Cambodia | Team portfolio site. | Next.js | https://hushstackcambodia.site/ |
   | 04 | Weather Web | Next.js weather app. | Next.js | https://weather.app.hushstackcambodia.site/ |

   All external links `target="_blank" rel="noopener"`.
5. **Contact** (`#b-contact`) — `padding: 48px 40px 56px`. Kicker `$ ./contact.sh`. Headline `LET'S BUILD` / `SOMETHING` in Silkscreen 30px followed by a blinking magenta 14×23px block. Then a wrapping button row (`gap: 12px`), each Silkscreen 10px, 3px border, `padding: 13px 16px`, `4px 4px 0 #000` shadow, press-down hover with border → `--cy`: **EMAIL** (`mailto:somonorhong011@gmail.com`), **GITHUB**, **LINKEDIN**, **X**, **REDDIT**, plus a non-link `DISCORD · cachewraith.dev` chip in `--cy-faint` (Discord has no URL).

**Command bar** — pinned below the scroll area, top border 3px, bg `--panel`, `padding: 11px 16px`, flex `gap: 8px`. Prompt `cd` in `--mg` + `›` in `--cy-faint`; transparent input, 12px, placeholder `try: about, skills, projects, contact, top`; right side shows the last result message (12px; `--cy-faint` on success, `--mg` on failure).

**Command bar behavior** — on Enter, normalize the input: trim, lowercase, strip a leading `cd `, strip a leading `./`, strip a trailing `/`. `about|skills|projects|contact` scroll to that section; `top|~|home` scroll to 0 and report `→ top`; success sets the message to `→ /<name>`; anything else sets `no such directory: <name>` in magenta and does not scroll. Typing again clears the message.

## Interactions & Behavior
- **Smooth scrolling** — nav links, both hero buttons, and the command bar all scroll smoothly. In the prototype this is `container.scrollTo({ top, behavior: 'smooth' })` with `preventDefault()` on the anchor click, because the scroll happens inside a fixed-height div. **In the Next.js build the page itself scrolls**, so this simplifies to `html { scroll-behavior: smooth }` plus `scroll-margin-top` on each section (account for the sticky titlebar height, ~39px) and plain `<a href="#about">` anchors. Keep `preventDefault` + programmatic scroll only for the command bar, which must also work for the `top` keyword.
- Hover states: links `--cy` → `--mg`; buttons compress their offset shadow and translate `3px, 3px`; project cards brighten their border to `--cy`.
- No loading, error, or form-validation states beyond the shell's "command not found" and the command bar's "no such directory".
- **Responsive** (not designed in the prototype — decide during implementation): below ~760px, collapse the About 2-col grid and Skills 2×2 to single column, drop the project card to `1fr` with the index inline and the `OPEN ↗` link below, reduce the hero name to ~34px, and let the shell output pane use `60vh` instead of a fixed 520px. The command bar should stay pinned.

## State Management
Client state only — no data fetching, no backend.

**1a shell:** `lines: {text, color}[]` (output buffer), `input: string`, `history: string[]`, `historyIndex: number` (−1 = not browsing). A `print(rows)` helper appends and then scrolls the pane to the bottom in the post-update callback. Content (projects, skills, contact) lives in module-level constants, not state.

**1b page:** `commandInput: string`, `message: string`, `messageOk: boolean`.

In Next.js both are client components (`'use client'`); the 1b content itself should be server-rendered markup with only the command bar as a client island.

## Assets
- **Fonts:** Silkscreen and JetBrains Mono from Google Fonts. In Next.js use `next/font/google` for both (`Silkscreen` weights 400/700, `JetBrains_Mono` 400/500/700) and expose them as CSS variables.
- **Images:** none yet. One placeholder awaits a **pixel-art avatar** (square, rendered at 96×96 in 1a; use `image-rendering: pixelated` so a small source stays crisp).
- **Icons:** none — every glyph is a text character (`↗`, `▮`, `›`, block-drawing characters in `neofetch`). Don't substitute an icon library.

## Files
- `Portfolio v2.dc.html` — both directions, 1a then 1b, with the full logic class at the bottom of the file. This is the single source of truth for the design.
- `Portfolio.dc.html` (not bundled) — an earlier green-phosphor exploration, superseded.
