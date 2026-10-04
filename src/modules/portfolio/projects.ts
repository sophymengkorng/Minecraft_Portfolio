import type { Project } from "./types";

/** Grid cards shown before "Show all", while no filter is picked. */
export const COLLAPSED_COUNT = 6;

/** Fewer projects than this and a filter bar is more noise than help. */
export const FILTER_MIN_PROJECTS = 4;

/** At most this many stack chips, the most used first. */
export const FILTER_MAX_CHIPS = 8;

/** Stack tags a compact card shows before folding the rest into "+N". */
export const CARD_MAX_TAGS = 4;

export interface StackFilter {
  /** Lowercased, so "Typescript" and "TypeScript" are one filter. */
  readonly key: string;
  /** The spelling seen first, for the chip. */
  readonly label: string;
  readonly count: number;
}

export const stackKey = (tech: string): string => tech.trim().toLowerCase();

/** Featured projects lead as spotlights; everything else goes in the grid. */
export function splitFeatured(projects: readonly Project[]): {
  spotlight: readonly Project[];
  grid: readonly Project[];
} {
  return {
    spotlight: projects.filter((project) => project.featured),
    grid: projects.filter((project) => !project.featured),
  };
}

/**
 * The chips for the filter bar: stacks used by more than one project, most
 * used first, ties alphabetical. A stack only one project uses filters down
 * to that single card, which the reader can already see.
 */
export function stackFilters(projects: readonly Project[]): readonly StackFilter[] {
  const seen = new Map<string, { label: string; count: number }>();

  for (const project of projects) {
    for (const key of new Set(project.stack.map(stackKey))) {
      if (!key) continue;
      const label = project.stack.find((tech) => stackKey(tech) === key) ?? key;
      const entry = seen.get(key);
      if (entry) entry.count += 1;
      else seen.set(key, { label: label.trim(), count: 1 });
    }
  }

  return [...seen]
    .map(([key, { label, count }]) => ({ key, label, count }))
    .filter((filter) => filter.count > 1)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, FILTER_MAX_CHIPS);
}

/** The `data-tags` value a card carries for the filter to match against. */
export const tagsAttribute = (project: Project): string =>
  project.stack.map(stackKey).join("|");
