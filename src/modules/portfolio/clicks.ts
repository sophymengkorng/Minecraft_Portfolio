import type { ProjectLink } from "./types";

/** Marks a project link to count: its value is the `ProjectLink` it points at. */
export const LINK_ATTRIBUTE = "data-project-link";
/** On the element wrapping one project's links. */
export const SLUG_ATTRIBUTE = "data-project-slug";

/** The console's `POST /portfolio/projects/{slug}/clicks` for one project. */
export function clickUrl(projectsEndpoint: string, slug: string): string {
  return `${projectsEndpoint}/${encodeURIComponent(slug)}/clicks`;
}

export function isProjectLink(value: string | null | undefined): value is ProjectLink {
  return value === "live" || value === "repo";
}

/**
 * The project and link a click landed on, or `null` when it missed every
 * counted link (or the markup is missing its attributes).
 */
export function clickedProjectLink(target: EventTarget | null): { slug: string; link: ProjectLink } | null {
  if (!(target instanceof Element)) return null;
  const anchor = target.closest(`a[${LINK_ATTRIBUTE}]`);
  const link = anchor?.getAttribute(LINK_ATTRIBUTE);
  const slug = anchor?.closest(`[${SLUG_ATTRIBUTE}]`)?.getAttribute(SLUG_ATTRIBUTE);
  return slug && isProjectLink(link) ? { slug, link } : null;
}

/**
 * Tells the console a project link was followed. A form-encoded beacon is a
 * CORS "simple" request — no preflight — and the browser delivers it even as
 * the link takes over the page. Best effort: a blocked or failed beacon is
 * dropped, and never delays the navigation.
 */
export function sendClick(url: string, link: ProjectLink): void {
  const body = new URLSearchParams({ link });
  try {
    if (navigator.sendBeacon?.(url, body)) return;
    void fetch(url, { method: "POST", body, mode: "no-cors", keepalive: true }).catch(() => {});
  } catch {
    // Blocked by an extension or the CSP — the visit just goes uncounted.
  }
}
