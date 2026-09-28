export type SectionId = "about" | "skills" | "projects" | "contact";

export interface Project {
  readonly index: string;
  readonly name: string;
  readonly description: string;
  readonly stack: readonly string[];
  readonly href: string;
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
