import type { Theme } from "@/modules/theme/theme";
import { SECTION_IDS, TOP_ALIASES } from "./constants";
import type { SectionId } from "./types";

/**
 * The chat bar's failure path ("unknown command") is an expected outcome, not
 * an exception — so `resolveCommand` returns a discriminated union (a Result)
 * and the caller renders whichever arm it gets. Keeping this a pure function
 * also makes it the one piece of real logic here that is unit-testable
 * without a DOM.
 */
export type NavCommand =
  | { readonly kind: "noop" }
  | { readonly kind: "top"; readonly message: string }
  | { readonly kind: "section"; readonly section: SectionId; readonly message: string }
  | { readonly kind: "theme"; readonly theme: Theme; readonly message: string }
  | { readonly kind: "unknown"; readonly message: string };

/**
 * trim → lowercase → drop a leading `/` → drop a leading `cd ` or `tp ` →
 * drop a leading `./` → drop a trailing `/`, so `/tp ./projects/`,
 * `cd projects` and `PROJECTS` all land on the same target.
 */
export function normalizeCommand(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^\/(?=.)/, "")
    .replace(/^(cd|tp)\s+/, "")
    .replace(/^\.\//, "")
    .replace(/\/$/, "")
    .replace(/\s+/g, " ");
}

function isSectionId(value: string): value is SectionId {
  return Object.hasOwn(SECTION_IDS, value);
}

/** `time set day|night` (the Minecraft way) or `theme light|dark`. */
const THEME_COMMANDS: Readonly<Record<string, Theme>> = {
  "time set day": "light",
  "time set noon": "light",
  "time set night": "dark",
  "time set midnight": "dark",
  "theme light": "light",
  "theme dark": "dark",
};

export function resolveCommand(raw: string): NavCommand {
  const input = normalizeCommand(raw);

  if (!input) return { kind: "noop" };

  if ((TOP_ALIASES as readonly string[]).includes(input)) {
    return { kind: "top", message: "Teleported to spawn" };
  }

  if (isSectionId(input)) {
    return { kind: "section", section: input, message: `Teleported to /${input}` };
  }

  if (Object.hasOwn(THEME_COMMANDS, input)) {
    const theme = THEME_COMMANDS[input] as Theme;
    return { kind: "theme", theme, message: `Set the time to ${theme === "dark" ? "night" : "day"}` };
  }

  return { kind: "unknown", message: `Unknown command: ${input}` };
}

/** The route a section lives at. Sections are bands on one page, not separate
 *  documents, but each gets a real hash-free URL that is served statically. */
export function sectionHref(section: SectionId): string {
  return `/${section}`;
}

/** The inverse: `/projects`, `/projects/`, `/PROJECTS` → `"projects"`. */
export function sectionFromPath(pathname: string): SectionId | null {
  const segment = pathname.replace(/^\/+/, "").replace(/\/+$/, "").toLowerCase();

  return isSectionId(segment) ? segment : null;
}
