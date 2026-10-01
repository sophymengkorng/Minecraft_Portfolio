/**
 * Day and night. The `data-theme` attribute on <html> is the single source of
 * truth: the boot script sets it before first paint, the toggle writes it, and
 * anything that cares (the CSS tokens, the voxel scene) reads or observes it.
 * That keeps the theme out of React state entirely, so nothing re-renders and
 * nothing can disagree with what is on screen.
 *
 * This file stays pure — no `window` — so it is unit-testable and importable
 * from server components (the layout inlines `THEME_BOOT_SCRIPT`).
 */

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
export const THEME_ATTRIBUTE = "data-theme";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

/** A stored choice wins; otherwise follow the OS. Junk in storage is ignored. */
export function resolveTheme(stored: string | null, prefersDark: boolean): Theme {
  if (isTheme(stored)) return stored;
  return prefersDark ? "dark" : "light";
}

export function nextTheme(theme: Theme): Theme {
  return theme === "dark" ? "light" : "dark";
}

/**
 * Runs synchronously in <head>, before the body paints, so the page never
 * flashes the wrong theme. Built only from the constants above — no request
 * data is interpolated — so inlining it is not an injection surface (A05).
 * `try` covers storage that throws (private mode, blocked site data).
 */
export const THEME_BOOT_SCRIPT = `(function(){var t;try{t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})}catch(e){}if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute(${JSON.stringify(
  THEME_ATTRIBUTE,
)},t)})()`;
