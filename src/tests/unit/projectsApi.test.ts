import { afterEach, describe, expect, it, vi } from "vitest";
import { getProjects, httpUrl, toProject, type ConsoleProject } from "@/modules/portfolio/api";

const item: ConsoleProject = {
  title: "WraithNote",
  slug: "wraithnote",
  description: "Block-based note-taking web app.",
  stack: ["Next.js", "NestJS"],
  liveUrl: "https://wraithnote.cachewraith.com/",
  repoUrl: "https://github.com/cachewraith/wraithnote",
  coverUrl: "https://console.cachewraith.com/storage/projects/a.webp",
  isFeatured: true,
};

function respond(body: unknown, status = 200) {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify(body), { status })));
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("httpUrl", () => {
  it("keeps http(s) links and drops everything else", () => {
    expect(httpUrl("https://a.com/x")).toBe("https://a.com/x");
    expect(httpUrl("http://a.com")).toBe("http://a.com/");
    expect(httpUrl("javascript:alert(1)")).toBeNull();
    expect(httpUrl("not a url")).toBeNull();
    expect(httpUrl("")).toBeNull();
    expect(httpUrl(null)).toBeNull();
  });
});

describe("toProject", () => {
  it("numbers by position and links the card to the live site, repo separately", () => {
    expect(toProject(item, 2)).toEqual({
      index: "03",
      slug: "wraithnote",
      name: "WraithNote",
      description: "Block-based note-taking web app.",
      stack: ["Next.js", "NestJS"],
      href: "https://wraithnote.cachewraith.com/",
      hrefLink: "live",
      repoHref: "https://github.com/cachewraith/wraithnote",
      coverUrl: "https://console.cachewraith.com/storage/projects/a.webp",
      featured: true,
    });
  });

  it("falls back to the repo as the card link, without a duplicate source link", () => {
    const project = toProject({ ...item, liveUrl: null }, 0);
    expect(project.href).toBe(item.repoUrl);
    expect(project.hrefLink).toBe("repo");
    expect(project.repoHref).toBeNull();
  });

  it("leaves a project with no links unlinked and fills nullable fields", () => {
    const project = toProject(
      { ...item, liveUrl: null, repoUrl: null, description: null, coverUrl: null, isFeatured: false },
      0,
    );
    expect(project).toMatchObject({ href: null, hrefLink: null, repoHref: null, description: "", coverUrl: null, featured: false });
  });
});

describe("getProjects", () => {
  it("maps the published list in order", async () => {
    respond({ data: [item, { ...item, title: "Two", slug: "two" }] });
    const projects = await getProjects();
    expect(projects.map((p) => [p.index, p.slug])).toEqual([["01", "wraithnote"], ["02", "two"]]);
  });

  it("returns an empty list when nothing is published", async () => {
    respond({ data: [] });
    expect(await getProjects()).toEqual([]);
  });

  it("throws on a console failure, so a regeneration keeps the last good page", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    respond({ message: "Server Error" }, 500);
    await expect(getProjects()).rejects.toThrow("Console API 500");
    respond({ nope: true });
    await expect(getProjects()).rejects.toThrow("missing data array");
    vi.stubGlobal("fetch", vi.fn(async () => { throw new TypeError("fetch failed"); }));
    await expect(getProjects()).rejects.toThrow("fetch failed");
  });

  it("falls back to an empty list during next build, so an outage can't block a deploy", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubEnv("NEXT_PHASE", "phase-production-build");
    vi.stubGlobal("fetch", vi.fn(async () => { throw new TypeError("fetch failed"); }));
    expect(await getProjects()).toEqual([]);
  });

  it("sends a timeout signal and refuses a plain-http console even at build", async () => {
    respond({ data: [] });
    await getProjects();
    const [url, init] = vi.mocked(fetch).mock.calls[0]!;
    expect(String(url)).toBe("https://console.cachewraith.com/api/v1/portfolio/projects");
    expect((init as RequestInit).signal).toBeInstanceOf(AbortSignal);

    vi.stubEnv("NEXT_PHASE", "phase-production-build");
    vi.stubEnv("CONSOLE_API_URL", "http://console.cachewraith.com/api/v1");
    await expect(getProjects()).rejects.toThrow("must use https://");
  });
});
