"use client";

import { useEffect } from "react";
import { sectionFromPath } from "@/modules/portfolio/navigation";
import {
  navigateToSection,
  navigateToTop,
  revealSection,
} from "@/modules/portfolio/scroll";
import { useScroller } from "./SmoothScroll";

/**
 * Turns `/projects` into "scroll to the projects band" on a page that is one
 * document. Every section link stays a plain server-rendered `<a href="/...">`,
 * and one delegated listener upgrades those clicks in place — rather than
 * making each link its own client component. With JS off the anchors still
 * work: each route is statically generated and serves this same page.
 *
 * `next/link` is deliberately not used. It calls `preventDefault` on the click
 * and pushes the route itself, which would scroll to the top of the page and
 * leave this handler nothing to act on.
 */
export function SectionRouter() {
  const scroller = useScroller();

  useEffect(() => {
    // A direct load of /projects arrives scrolled to the top; jump, don't glide.
    const landing = sectionFromPath(window.location.pathname);
    if (landing) revealSection(scroller, landing, true);

    function handleClick(event: MouseEvent) {
      const openingElsewhere =
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey;
      if (event.defaultPrevented || openingElsewhere) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.origin !== window.location.origin
      ) {
        return;
      }

      // The brand mark and "back to top" both point at the home route.
      if (anchor.pathname === "/" && !anchor.hash) {
        event.preventDefault();
        navigateToTop(scroller);
        return;
      }

      const section = sectionFromPath(anchor.pathname);
      if (!section) return;

      event.preventDefault();
      navigateToSection(scroller, section);
    }

    function handlePopState() {
      const section = sectionFromPath(window.location.pathname);
      if (section) revealSection(scroller, section);
      else scroller.toTop();
    }

    document.addEventListener("click", handleClick);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [scroller]);

  return null;
}
