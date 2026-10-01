import {
  siApachekafka,
  siArchlinux,
  siDocker,
  siFastapi,
  siGithub,
  siLaravel,
  siNestjs,
  siNextdotjs,
  siReact,
  siRedis,
  siSpringboot,
  type SimpleIcon,
} from "simple-icons";

/**
 * Real logos for the skills, from Simple Icons (CC0), as bare 24x24 SVG paths.
 * Only server components import this, so the path data is rendered into the
 * HTML and never ships in a client bundle.
 */

export interface SkillIcon {
  /** A single path on a 24x24 viewBox. */
  readonly path: string;
  /** The colour to draw it in on the dark inventory slots. */
  readonly color: string;
}

/**
 * Simple Icons no longer carries Microsoft's marks, so VS Code gets a plain
 * `< >` code glyph in its blue rather than a lookalike of the real logo.
 */
const CODE_GLYPH: SkillIcon = {
  path: "M9 6 3 12l6 6 1.4-1.4L5.8 12l4.6-4.6zm6 0-1.4 1.4 4.6 4.6-4.6 4.6L15 18l6-6z",
  color: "#2f9bf0",
};

const BRANDS: Readonly<Record<string, SimpleIcon>> = {
  Laravel: siLaravel,
  NestJS: siNestjs,
  "Spring Boot": siSpringboot,
  FastAPI: siFastapi,
  React: siReact,
  "Next.js": siNextdotjs,
  Docker: siDocker,
  Redis: siRedis,
  Kafka: siApachekafka,
  GitHub: siGithub,
  "Arch Linux": siArchlinux,
};

/** WCAG relative luminance of a `RRGGBB` hex string, 0 (black) to 1 (white). */
export function luminance(hex: string): number {
  const channel = (offset: number) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

/**
 * The logo for a skill, or `null` when there is none (the slot then falls
 * back to the name's initials). Near-black brand colours — Next.js, GitHub,
 * Kafka — would vanish on a dark slot, so those draw in white.
 */
export function skillIcon(name: string): SkillIcon | null {
  if (name === "VS Code") return CODE_GLYPH;
  if (!Object.hasOwn(BRANDS, name)) return null;

  const brand = BRANDS[name] as SimpleIcon;
  return { path: brand.path, color: luminance(brand.hex) < 0.05 ? "#ffffff" : `#${brand.hex}` };
}
