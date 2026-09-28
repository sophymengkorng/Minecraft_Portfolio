import { isTheme, THEME_ATTRIBUTE, THEME_STORAGE_KEY, type Theme } from "./theme";

/**
 * The browser half of theming: reading, writing and watching the attribute.
 * Only client components import this.
 */

export function readTheme(): Theme {
  const value = document.documentElement.getAttribute(THEME_ATTRIBUTE);
  return isTheme(value) ? value : "light";
}

export function writeTheme(theme: Theme): void {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }
}

/**
 * Applies a theme, revealing it through a circle that grows out of `origin`
 * (the toggle, usually). A view transition snapshots the page once and animates
 * one clip-path on the compositor — far cheaper than transitioning every
 * colour on every element. Without view transitions, or with reduced motion,
 * the theme simply switches.
 */
export function switchTheme(theme: Theme, origin?: { x: number; y: number }): void {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduceMotion) {
    writeTheme(theme);
    return;
  }

  const x = origin?.x ?? window.innerWidth - 40;
  const y = origin?.y ?? 32;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  const transition = document.startViewTransition(() => writeTheme(theme));
  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    })
    // Skipped transition (another one started, tab hidden): the theme still applied.
    .catch(() => {});
}

/** Calls `listener` whenever the theme attribute changes. Returns the unsubscribe. */
export function watchTheme(listener: (theme: Theme) => void): () => void {
  const observer = new MutationObserver(() => listener(readTheme()));
  observer.observe(document.documentElement, { attributes: true, attributeFilter: [THEME_ATTRIBUTE] });
  return () => observer.disconnect();
}
