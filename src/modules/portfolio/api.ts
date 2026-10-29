import type { Project } from "./types";

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

export function httpUrl(value: unknown): string | null {
  if (typeof value !== "string" || value === "") return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

export function toProject(item: ConsoleProject, position: number): Project {
  const live = httpUrl(item.liveUrl);
  const repo = httpUrl(item.repoUrl);
  const cover = typeof item.coverUrl === "string" && item.coverUrl.startsWith("/")
    ? item.coverUrl
    : httpUrl(item.coverUrl);
  return {
    index: String(position + 1).padStart(2, "0"),
    slug: item.slug,
    name: item.title,
    description: item.description ?? "",
    stack: Array.isArray(item.stack) ? item.stack : [],
    href: live ?? repo,
    hrefLink: live ? "live" : repo ? "repo" : null,
    repoHref: live ? repo : null,
    coverUrl: cover,
    featured: item.isFeatured === true,
  };
}

const OFFICIAL_PROJECTS: readonly ConsoleProject[] = [
  {
    title: "Student Assistant",
    slug: "student-assistant",
    description: "A secure student assistant for managing schedules, Tasks, Documents, Profiles, And Deadline Notifications in one Responsive workspace.",
    stack: ["Next.js", "TypeScript", "Supabase", "Vercel"],
    liveUrl: "https://classworkmanagement.vercel.app",
    repoUrl: "https://github.com/sophymengkorng/classworkmanagement",
    coverUrl: "/reference/projects/student-assistant-dashboard.png",
    isFeatured: true,
  },
  {
    title: "Pokemon Ecommerce",
    slug: "pokemon-ecommerce",
    description: "A responsive Pokemon ecommerce storefront with product discovery, Search, Filtering, Favorites, Cart Management, And a Simulated Checkout Flow.",
    stack: ["HTML", "CSS", "JavaScript", "PokeAPI"],
    liveUrl: "https://genzpokemonstore.vercel.app/",
    repoUrl: "https://github.com/sophymengkorng/Ecommerce",
    coverUrl: "/reference/projects/pokemon-marketplace-official.png",
    isFeatured: true,
  },
  {
    title: "Personal Portfolio",
    slug: "personal-portfolio",
    description: "A responsive personal website presenting my background, Education, Projects, Skills, And Contact Information through a clean Bootstrap interface.",
    stack: ["HTML", "CSS", "JavaScript", "Bootstrap"],
    liveUrl: "https://midtermportfolio.vercel.app/",
    repoUrl: "https://github.com/sophymengkorng/midterm-portfolio",
    coverUrl: "/reference/projects/midterm-portfolio.png",
    isFeatured: true,
  },
];

export async function getProjects(): Promise<readonly Project[]> {
  return OFFICIAL_PROJECTS.map(toProject);
}
