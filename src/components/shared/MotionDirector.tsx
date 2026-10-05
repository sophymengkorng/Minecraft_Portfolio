"use client";

import {
  activeNavLink,
  fillOnScroll,
  heroOutro,
  hotbar,
  magnetic,
  popIn,
  projectFilter,
  revealLines,
  revealOnEnter,
  revealProjects,
  scrambleText,
  scrollProgress,
  wipeIn,
  xpLevel,
} from "@/modules/motion/effects";
import { gsap, ScrollTrigger, useGSAP } from "@/modules/motion/gsap";

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/**
 * The page's one animation client component. Sections stay server components
 * and only mark elements with `data-*` hooks; this applies the matching effect
 * to each. The rejected alternative — a `useGSAP` per section — would have
 * made every section a client component for a few lines of animation each.
 *
 * `gsap.matchMedia` gates each effect by condition and reverts it — splits
 * included — when the condition stops matching.
 */
export function MotionDirector() {
  useGSAP((context) => {
    const media = gsap.matchMedia();

    // Before any trigger is measured: it folds the project grid. It filters
    // for everyone; only the Flip between states needs motion.
    const stopProjects = projectFilter(context, () => window.matchMedia(MOTION_OK).matches);

    media.add(MOTION_OK, () => {
      heroOutro();
      popIn();
      fillOnScroll();
      revealLines();
      revealOnEnter();
      revealProjects();
      wipeIn();
      const stopScramble = scrambleText();
      const stopHotbar = hotbar();
      return () => {
        stopScramble();
        stopHotbar();
      };
    });

    media.add(`(pointer: fine) and ${MOTION_OK}`, magnetic);

    // Not motion in the vestibular sense — both just track scroll position.
    scrollProgress();
    activeNavLink();
    xpLevel();

    // Web fonts change line heights, which moves every trigger below the fold.
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      stopProjects();
      media.revert();
    };
  });

  return null;
}
