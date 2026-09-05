import type { ContactLink, MetaRow, Project, SkillGroup } from "./types";

export const IDENTITY = {
  name: "Somonor Hong",
  nameLines: ["SOMONOR", "HONG"] as const,
  role: "SOFTWARE ENGINEER",
  alias: "aka CACHEWRAITH",
  pitch:
    "Software Engineer building backend systems with Laravel, NestJS, and Spring Boot, and shipping full-stack side projects with Next.js, React, RabbitMQ, and Postgres.",
  bio: "Junior Backend Developer, building backend systems with Laravel, NestJS, and Spring Boot.",
} as const;

export const ABOUT_META: readonly MetaRow[] = [
  { label: "focus", value: "Backend" },
  { label: "editor", value: "VS Code" },
  { label: "os", value: "Arch Linux ▮", accent: true },
];

export const SKILL_GROUPS: readonly SkillGroup[] = [
  { heading: "BACKEND", items: ["Laravel", "NestJS", "Spring Boot", "FastAPI"] },
  { heading: "FRONTEND", items: ["React", "Next.js"] },
  { heading: "INFRA & DATA", items: ["Docker", "Redis", "Kafka"] },
  { heading: "TOOLS", items: ["GitHub", "VS Code", "Arch Linux"] },
];

export const PROJECTS: readonly Project[] = [
  {
    index: "01",
    name: "WraithNote",
    description: "Block-based note-taking web app.",
    stack: ["Next.js", "NestJS", "RabbitMQ", "Redis", "Postgres"],
    href: "https://wraithnote.cachewraith.com/",
  },
  {
    index: "02",
    name: "cachewraith-desktop-pet",
    description: "Desktop pet app.",
    stack: ["Tauri 2", "React", "PixiJS", "XState", "Rust"],
    // Releases rather than the repo: this one is something to download and run.
    href: "https://github.com/cachewraith/cachewraith-desktop-pet/releases",
  },
  {
    index: "03",
    name: "Weather Web",
    description: "Next.js weather app.",
    stack: ["Next.js"],
    href: "https://weather.app.hushstackcambodia.site/",
  },
  {
    index: "04",
    name: "laravel-template-structure",
    description: "Installer package that scaffolds a layered Laravel architecture.",
    stack: ["Laravel", "PHP", "Blade", "Sanctum", "Docker"],
    // Packagist rather than the repo: this one is consumed with `composer require`.
    href: "https://packagist.org/packages/cachewraith/laravel-template-structure",
  },
  {
    index: "05",
    name: "DBML Previewer",
    description: "Live DBML diagram editor and previewer — write DBML, see the ER diagram instantly.",
    stack: ["Next.js", "React", "React Flow", "DBML", "Tailwind CSS"],
    href: "https://dbml.hushstackcambodia.site/",
  },
];

export const CONTACT_LINKS: readonly ContactLink[] = [
  { label: "EMAIL", href: "mailto:somonorhong011@gmail.com", external: false },
  { label: "GITHUB", href: "https://github.com/cachewraith", external: true },
  { label: "LINKEDIN", href: "https://www.linkedin.com/in/somonor-hong-9b44902b0/", external: true },
  { label: "X", href: "https://x.com/cachewraith", external: true },
  { label: "REDDIT", href: "https://www.reddit.com/user/Outrageous-Pilot-943/", external: true },
];

/** Discord has no URL, so it renders as a plain chip rather than a link. */
export const DISCORD_CHIP = "DISCORD · cachewraith.dev";
