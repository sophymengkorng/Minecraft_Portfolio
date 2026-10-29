import type { ContactLink, MetaRow, SectionCopy, SectionId, SkillGroup } from "./types";

export const IDENTITY = {
  name: "Sophy Mengkorng",
  nameLines: ["SOPHY", "MENGKORNG"] as const,
  role: "Frontend Developer",
  alias: "MIS student · Phnom Penh",
  pitch:
    "Management Information Systems student at SETEC Institute building thoughtful, Responsive web experiences with Next.js, Angular, Supabase, And APIs.",
  joined: "sophymengkorng joined the game",
  bio: "Frontend Developer and MIS Student turning ideas into useful digital products.",
} as const;

export const SPLASHES = [
  "Build with purpose!",
  "Frontend in progress!",
  "Ideas into interfaces!",
  "SETEC Institute!",
  "Responsive by design!",
  "Works on my machine!",
  "Keep learning!",
  "Let's build it!",
] as const;

export const SECTION_COPY = {
  about: { index: "01", kicker: "$ cat about.md", title: ["About", "me"] },
  skills: { index: "02", kicker: "$ ls ~/toolkit", title: ["Skill", "inventory"] },
  projects: { index: "03", kicker: "$ git log --oneline", title: ["Selected", "work"] },
  contact: { index: "04", kicker: "$ ./join-server.sh", title: ["Let's build", "something."] },
} as const satisfies Record<SectionId, SectionCopy>;

export const DEBUG_TITLE = "sophymengkorng.dev (vanilla)";
export const PROJECT_TOAST = "Project published!";
export const FEATURED_PROJECT_TOAST = "Featured project!";
export const CONTACT_COPY = { directConnect: "Direct connect", serverList: "Social links" } as const;

export const ABOUT_META: readonly MetaRow[] = [
  { label: "focus", value: "Frontend" },
  { label: "school", value: "SETEC Institute" },
  { label: "location", value: "Phnom Penh", accent: true },
];

export const SKILL_GROUPS: readonly SkillGroup[] = [
  { heading: "Frontend", items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Angular"] },
  { heading: "Programming", items: ["C#", "C++", "Python"] },
  { heading: "UI & Data", items: ["Bootstrap", "Responsive Design"] },
  { heading: "Tools", items: ["Git", "GitHub", "VS Code", "Vercel", "Figma"] },
];

export const EMAIL: ContactLink = {
  label: "Email",
  href: "mailto:sophymengkorng@gmail.com",
  handle: "sophymengkorng@gmail.com",
  external: false,
};

export const SOCIAL_LINKS: readonly ContactLink[] = [
  { label: "Telegram", href: "https://t.me/sophymengkorng", handle: "@sophymengkorng", external: true },
  { label: "GitHub", href: "https://github.com/sophymengkorng", handle: "github.com/sophymengkorng", external: true },
  { label: "Facebook", href: "https://www.facebook.com/", handle: "Sophy Mengkorng", external: true },
];

export const DISCORD = { label: "Availability", handle: "Internships & collaborations" } as const;

export const FOOTER = {
  builtWith: "Built with Next.js, GSAP & Three.js",
  disclaimer: "Portfolio of Sophy Mengkorng, Frontend Developer and MIS Student.",
} as const;

export const PROJECTS_EMPTY = "Projects are being prepared. Check back soon.";
