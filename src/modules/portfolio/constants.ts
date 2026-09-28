import type { SectionId } from "./types";

/**
 * DOM ids for the scrollable sections. The command bar and the titlebar nav both
 * resolve to these, so they live in one place rather than being spelled out at
 * each call site.
 */
export const SECTION_IDS = {
  about: "b-about",
  skills: "b-skills",
  projects: "b-projects",
  contact: "b-contact",
} as const satisfies Record<SectionId, string>;

export const SECTION_ORDER = ["about", "skills", "projects", "contact"] as const;

/** Aliases accepted by the command bar for "scroll back to the top". */
export const TOP_ALIASES = ["top", "~", "home", "spawn"] as const;
