import { SECTION_IDS, TOP_ALIASES } from "./constants";
import type { SectionId } from "./types";

/**
 * The command bar's failure path ("no such directory") is an expected outcome,
 * not an exception — so `resolveCommand` returns a discriminated union (a
 * Result) and the caller renders whichever arm it gets. Keeping this a pure
 * function also makes it the one piece of real logic here that is unit-testable
 * without a DOM.
 */
export type NavCommand =
  | { readonly kind: "noop" }
  | { readonly kind: "top"; readonly message: string }
  | { readonly kind: "section"; readonly section: SectionId; readonly message: string }
  | { readonly kind: "unknown"; readonly message: string };

/**
 * trim → lowercase → drop a leading `cd ` → drop a leading `./` → drop a
 * trailing `/`, so `cd ./projects/` and `PROJECTS` land on the same target.
 */
export function normalizeCommand(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^cd\s+/, "")
    .replace(/^\.\//, "")
    .replace(/\/$/, "");
}

function isSectionId(value: string): value is SectionId {
  return Object.hasOwn(SECTION_IDS, value);
}

export function resolveCommand(raw: string): NavCommand {
  const input = normalizeCommand(raw);

  if (!input) return { kind: "noop" };

  if ((TOP_ALIASES as readonly string[]).includes(input)) {
    return { kind: "top", message: "→ top" };
  }

  if (isSectionId(input)) {
    return {
      kind: "section",
      section: input,
      message: `→ /${input}`,
    };
  }

  return { kind: "unknown", message: `no such directory: ${input}` };
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
