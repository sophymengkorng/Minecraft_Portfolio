"use client";

import { useEffect } from "react";
import { clickedProjectLink, clickUrl, sendClick } from "@/modules/portfolio/clicks";

/**
 * Counts clicks on the project cards' links in the console. One delegated
 * listener on the document: the cards stay server components, and a card
 * re-shown by the filter needs nothing re-bound. `auxclick` catches a
 * middle-click opening the link in a background tab; a right-click (button 2)
 * only opens the menu, so it isn't counted.
 */
export function ProjectClickTracker({ endpoint }: { endpoint: string }) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.type === "auxclick" && event.button !== 1) return;
      const clicked = clickedProjectLink(event.target);
      if (clicked) sendClick(clickUrl(endpoint, clicked.slug), clicked.link);
    };

    document.addEventListener("click", onClick);
    document.addEventListener("auxclick", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("auxclick", onClick);
    };
  }, [endpoint]);

  return null;
}
