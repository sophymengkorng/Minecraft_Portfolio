import { describe, expect, it } from "vitest";
import {
  FILTER_MAX_CHIPS,
  splitFeatured,
  stackFilters,
  tagsAttribute,
} from "@/modules/portfolio/projects";
import type { Project } from "@/modules/portfolio/types";

const project = (slug: string, stack: string[], featured = false): Project => ({
  index: "01",
  slug,
  name: slug,
  description: "",
  stack,
  href: null,
  hrefLink: null,
  repoHref: null,
  coverUrl: null,
  featured,
});

describe("splitFeatured", () => {
  it("puts featured projects in the spotlight and keeps order in both lists", () => {
    const list = [project("a", []), project("b", [], true), project("c", []), project("d", [], true)];
    const { spotlight, grid } = splitFeatured(list);
    expect(spotlight.map((p) => p.slug)).toEqual(["b", "d"]);
    expect(grid.map((p) => p.slug)).toEqual(["a", "c"]);
  });
});

describe("stackFilters", () => {
  it("merges spellings, drops one-off stacks, sorts by use then name", () => {
    const filters = stackFilters([
      project("a", ["Next.js", "Typescript", "Go"]),
      project("b", ["next.js", "TypeScript"]),
      project("c", ["Next.js", "CSS"]),
      project("d", ["CSS"]),
    ]);
    expect(filters).toEqual([
      { key: "next.js", label: "Next.js", count: 3 },
      { key: "css", label: "CSS", count: 2 },
      { key: "typescript", label: "Typescript", count: 2 },
    ]);
  });

  it("counts a stack once per project, even if listed twice", () => {
    expect(stackFilters([project("a", ["Go", "go"]), project("b", ["Go"])])).toEqual([
      { key: "go", label: "Go", count: 2 },
    ]);
  });

  it("caps the chip count", () => {
    const stack = Array.from({ length: 20 }, (_, i) => `t${i}`);
    expect(stackFilters([project("a", stack), project("b", stack)])).toHaveLength(FILTER_MAX_CHIPS);
  });
});

describe("tagsAttribute", () => {
  it("joins lowercased keys with |, which no stack name contains", () => {
    expect(tagsAttribute(project("a", ["Next.js", " Tailwind CSS "]))).toBe("next.js|tailwind css");
  });
});
