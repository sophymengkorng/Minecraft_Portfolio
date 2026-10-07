export type SectionId = "about" | "skills" | "projects" | "contact";

/** Which of a project's links was followed — the console counts clicks per link. */
export type ProjectLink = "live" | "repo";

export interface Project {
  readonly index: string;
  /** Stable across renames — used as the React key. */
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly stack: readonly string[];
  /** Where the card goes: the live site, else the repo. `null` = not linked. */
  readonly href: string | null;
  /** Whether `href` is the live site or the repo. `null` = not linked. */
  readonly hrefLink: ProjectLink | null;
  /** A separate "source" link, only when the card already points elsewhere. */
  readonly repoHref: string | null;
  readonly coverUrl: string | null;
  /** "Feature on homepage" in the console. */
  readonly featured: boolean;
}

export interface SkillGroup {
  readonly heading: string;
  readonly items: readonly string[];
}

export interface MetaRow {
  readonly label: string;
  readonly value: string;
  /** Rendered in the brand gradient rather than ink — used for the `os` row. */
  readonly accent?: boolean;
}

/** The eyebrow, number and heading that open each section. */
export interface SectionCopy {
  readonly index: string;
  /** The shell command shown as the eyebrow — the terminal theme's one holdover. */
  readonly kicker: string;
  /** One entry per rendered line; the last line takes the brand gradient. */
  readonly title: readonly string[];
}

export interface ContactLink {
  readonly label: string;
  readonly href: string;
  /** What the row shows in large type — the address or username. */
  readonly handle: string;
  /** mailto: links must not be opened in a new tab. */
  readonly external: boolean;
}
