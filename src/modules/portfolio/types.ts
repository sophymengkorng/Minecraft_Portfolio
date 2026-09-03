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
  /** Rendered in cyan rather than ink — used for the `os` row. */
  readonly accent?: boolean;
}

export interface ContactLink {
  readonly label: string;
  readonly href: string;
  /** mailto: links must not be opened in a new tab. */
  readonly external: boolean;
}
