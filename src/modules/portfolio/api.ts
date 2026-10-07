import { consoleApiUrl } from "@/config/console";
import type { Project } from "./types";

/** Shape of one item from the console's `GET /api/v1/portfolio/projects`. */
export interface ConsoleProject {
  readonly title: string;
  readonly slug: string;
  readonly description: string | null;
  readonly stack: readonly string[];
  readonly liveUrl: string | null;
  readonly repoUrl: string | null;
  readonly coverUrl: string | null;
  readonly isFeatured: boolean;
}

/** How long a fetched list is reused before the next request re-checks it. */
const REVALIDATE_SECONDS = 60;

/** A hung console must not hold a regeneration or a build for minutes. */
const TIMEOUT_MS = 5000;

/**
 * A10 / A03 defence in depth: the console only stores http(s) links, but a
 * value that ends up in an `href` or `src` is re-checked here rather than trusted.
 */
export function httpUrl(value: unknown): string | null {
  if (typeof value !== "string" || value === "") return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

/**
 * Maps one API item onto the site's `Project`. The number comes from the
 * position, the card links to the live site and falls back to the repo, and
 * the repo gets its own link only when it isn't already the card's target.
 */
export function toProject(item: ConsoleProject, position: number): Project {
  const live = httpUrl(item.liveUrl);
  const repo = httpUrl(item.repoUrl);

  return {
    index: String(position + 1).padStart(2, "0"),
    slug: item.slug,
    name: item.title,
    description: item.description ?? "",
    stack: Array.isArray(item.stack) ? item.stack : [],
    href: live ?? repo,
    hrefLink: live ? "live" : repo ? "repo" : null,
    repoHref: live ? repo : null,
    coverUrl: httpUrl(item.coverUrl),
    featured: item.isFeatured === true,
  };
}

/** Keeps only items carrying the fields the card cannot render without. */
function isConsoleProject(value: unknown): value is ConsoleProject {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return typeof item.title === "string" && typeof item.slug === "string";
}

/** True while `next build` is prerendering, as opposed to a later regeneration. */
const isBuildPhase = () => process.env.NEXT_PHASE === "phase-production-build";

/**
 * The published projects, in the order arranged in the console. Fetched on
 * the server and cached for `REVALIDATE_SECONDS`, so visitors never hit the
 * console's per-IP limit.
 *
 * When the console is down, slow or answers with something unexpected:
 * - during a background regeneration this throws, and Next keeps serving the
 *   last good page and retries on the next request — an outage never
 *   replaces real projects with the empty state;
 * - during `next build` it returns an empty list, so a console outage can't
 *   block a deploy; the first successful regeneration fills the section in.
 *
 * A misconfigured `CONSOLE_API_URL` (see `consoleApiUrl`) throws in both
 * cases: that is a mistake to fix, not an outage to ride out.
 */
export async function getProjects(): Promise<readonly Project[]> {
  const endpoint = `${consoleApiUrl().href}/portfolio/projects`;

  try {
    const res = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`Console API ${res.status}`);

    const body: unknown = await res.json();
    const data = (body as { data?: unknown } | null)?.data;
    if (!Array.isArray(data)) throw new Error("Console API: missing data array");

    return data.filter(isConsoleProject).map(toProject);
  } catch (error) {
    console.error("[projects] could not load from the console:", error);
    if (isBuildPhase()) return [];
    throw error;
  }
}
