import type { ContactLink, MetaRow, SectionCopy, SectionId, SkillGroup } from "./types";

export const IDENTITY = {
  name: "Somonor Hong",
  nameLines: ["SOMONOR", "HONG"] as const,
  role: "Software Engineer",
  alias: "aka cachewraith",
  pitch:
    "Software Engineer building backend systems with Laravel, NestJS, and Spring Boot, and shipping full-stack side projects with Next.js, React, RabbitMQ, and Postgres.",
  /** The hero's eyebrow — the yellow system line from the game's chat. */
  joined: "cachewraith joined the game",
  bio: "Junior Backend Developer, building backend systems with Laravel, NestJS, and Spring Boot.",
} as const;

/**
 * The yellow splash under the name, Minecraft title-screen style. Clicking it
 * shows the next one.
 */
export const SPLASHES = [
  "Compiles first try!",
  "Now with Kafka!",
  "sudo pacman -Syu!",
  "Also try NestJS!",
  "100% backend!",
  "Works on my machine!",
  "Redis cached!",
  "git push --force? No!",
] as const;

export const SECTION_COPY = {
  about: { index: "01", kicker: "$ cat about.md", title: ["About", "me"] },
  skills: { index: "02", kicker: "$ ls ~/inventory", title: ["Skill", "inventory"] },
  projects: { index: "03", kicker: "$ git log --oneline", title: ["Selected", "work"] },
  contact: { index: "04", kicker: "$ ./join-server.sh", title: ["Let's build", "something."] },
} as const satisfies Record<SectionId, SectionCopy>;

/** Heading of the F3-style debug panel in the about section. */
export const DEBUG_TITLE = "somonor-hong.dev (vanilla)";

/** The toast line above every project, like an advancement popping in. */
export const PROJECT_TOAST = "Advancement made!";

/** Featured projects pop the rarer toast. */
export const FEATURED_PROJECT_TOAST = "Challenge complete!";

/** The contact section's server-list heading and the line under the email. */
export const CONTACT_COPY = {
  directConnect: "Direct connect",
  serverList: "Server list",
} as const;

export const ABOUT_META: readonly MetaRow[] = [
  { label: "focus", value: "Backend" },
  { label: "editor", value: "VS Code" },
  { label: "os", value: "Arch Linux", accent: true },
];

export const SKILL_GROUPS: readonly SkillGroup[] = [
  { heading: "Backend", items: ["Laravel", "NestJS", "Spring Boot", "FastAPI"] },
  { heading: "Frontend", items: ["React", "Next.js"] },
  { heading: "Infra & Data", items: ["Docker", "Redis", "Kafka"] },
  { heading: "Tools", items: ["GitHub", "VS Code", "Arch Linux"] },
];

/** The contact section's headline link. */
export const EMAIL: ContactLink = {
  label: "Email",
  href: "mailto:somonorhong011@gmail.com",
  handle: "somonorhong011@gmail.com",
  external: false,
};

export const SOCIAL_LINKS: readonly ContactLink[] = [
  { label: "GitHub", href: "https://github.com/cachewraith", handle: "@cachewraith", external: true },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/somonor-hong-9b44902b0/",
    handle: "Somonor Hong",
    external: true,
  },
  { label: "X", href: "https://x.com/cachewraith", handle: "@cachewraith", external: true },
  {
    label: "Reddit",
    href: "https://www.reddit.com/user/Outrageous-Pilot-943/",
    handle: "u/Outrageous-Pilot-943",
    external: true,
  },
];

/** Discord has no URL, so it renders as a plain row rather than a link. */
export const DISCORD = { label: "Discord", handle: "cachewraith.dev" } as const;

export const FOOTER = {
  builtWith: "Built with Next.js, GSAP & Three.js",
  disclaimer: "Not an official Minecraft product. Not affiliated with Mojang or Microsoft.",
} as const;

/** Shown in the projects section when the console has nothing published. */
export const PROJECTS_EMPTY = "Nothing crafted yet — check back soon.";
