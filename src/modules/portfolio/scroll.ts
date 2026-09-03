import { SECTION_IDS } from "./constants";
import { sectionHref } from "./navigation";
import type { SectionId } from "./types";

/**
 * The browser half of section navigation: scrolling and the address bar. Kept
 * apart from `navigation.ts` — that module stays pure and unit-tested; this one
 * touches `window` and is only ever imported by client components.
 *
 * Every URL written here is built by `sectionHref` from the `SectionId` union,
 * never from a clicked element's own href, so nothing a document contains can
 * steer `pushState` at a path this app did not author (A01).
 */

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

/** `scroll-margin-top` on the section clears the sticky titlebar. */
export function revealSection(section: SectionId, behavior = scrollBehavior()): void {
  document
    .getElementById(SECTION_IDS[section])
    ?.scrollIntoView({ behavior, block: "start" });
}

export function revealTop(behavior = scrollBehavior()): void {
  window.scrollTo({ top: 0, behavior });
}

/** Scroll to a section and put its route in the address bar, with no reload. */
export function navigateToSection(section: SectionId): void {
  window.history.pushState(null, "", sectionHref(section));
  revealSection(section);
}

export function navigateToTop(): void {
  window.history.pushState(null, "", "/");
  revealTop();
}
