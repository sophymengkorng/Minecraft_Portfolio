import type Lenis from "lenis";
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

/**
 * Adapter over whatever is moving the page. With smooth scrolling on, a native
 * `scrollIntoView` would fight Lenis for the scroll position, so every jump goes
 * through this one seam and `SmoothScroll` swaps in the Lenis-backed adapter.
 */
export interface Scroller {
  toElement(element: HTMLElement, immediate?: boolean): void;
  toTop(immediate?: boolean): void;
}

function nativeBehavior(immediate: boolean): ScrollBehavior {
  return immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

export const nativeScroller: Scroller = {
  toElement(element, immediate = false) {
    element.scrollIntoView({ behavior: nativeBehavior(immediate), block: "start" });
  },
  toTop(immediate = false) {
    window.scrollTo({ top: 0, behavior: nativeBehavior(immediate) });
  },
};

const LENIS_JUMP = {
  duration: 1.6,
  // easeOutExpo: fast off the mark, long settle — matches the GSAP reveals.
  easing: (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t)),
  force: true,
} as const;

export function lenisScroller(lenis: Lenis): Scroller {
  return {
    toElement(element, immediate = false) {
      lenis.scrollTo(element, { ...LENIS_JUMP, immediate });
    },
    toTop(immediate = false) {
      lenis.scrollTo(0, { ...LENIS_JUMP, immediate });
    },
  };
}

export function revealSection(scroller: Scroller, section: SectionId, immediate = false): void {
  const element = document.getElementById(SECTION_IDS[section]);
  if (element) scroller.toElement(element, immediate);
}

/** Scroll to a section and put its route in the address bar, with no reload. */
export function navigateToSection(scroller: Scroller, section: SectionId): void {
  window.history.pushState(null, "", sectionHref(section));
  revealSection(scroller, section);
}

export function navigateToTop(scroller: Scroller): void {
  window.history.pushState(null, "", "/");
  scroller.toTop();
}
