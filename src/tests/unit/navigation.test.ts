import { describe, expect, it } from "vitest";
import {
  normalizeCommand,
  resolveCommand,
  sectionFromPath,
  sectionHref,
} from "@/modules/portfolio/navigation";

describe("normalizeCommand", () => {
  it("trims, lowercases, and strips /, cd, tp, ./ and a trailing slash", () => {
    expect(normalizeCommand("/tp ./projects/")).toBe("projects");
    expect(normalizeCommand("TP skills")).toBe("skills");
    expect(normalizeCommand("/")).toBe("");
    expect(normalizeCommand("  CD ./Projects/  ")).toBe("projects");
    expect(normalizeCommand("cd contact")).toBe("contact");
    expect(normalizeCommand("./skills")).toBe("skills");
    expect(normalizeCommand("ABOUT/")).toBe("about");
  });
});

describe("resolveCommand", () => {
  it("treats empty input as a no-op", () => {
    expect(resolveCommand("   ").kind).toBe("noop");
  });

  it.each(["top", "~", "home", "cd ~", "/tp spawn"])("scrolls to the top for %s", (input) => {
    expect(resolveCommand(input)).toEqual({ kind: "top", message: "Teleported to spawn" });
  });

  it.each(["about", "skills", "projects", "contact"])(
    "resolves %s to its section",
    (input) => {
      expect(resolveCommand(input)).toEqual({
        kind: "section",
        section: input,
        message: `Teleported to /${input}`,
      });
    },
  );

  it.each([
    ["/time set night", "dark", "Set the time to night"],
    ["time  set   day", "light", "Set the time to day"],
    ["theme dark", "dark", "Set the time to night"],
  ] as const)("switches the theme for %s", (input, theme, message) => {
    expect(resolveCommand(input)).toEqual({ kind: "theme", theme, message });
  });

  it("reports unknown commands without scrolling", () => {
    expect(resolveCommand("resume")).toEqual({
      kind: "unknown",
      message: "Unknown command: resume",
    });
  });

  it("does not resolve inherited Object.prototype keys as sections", () => {
    expect(resolveCommand("constructor").kind).toBe("unknown");
    expect(resolveCommand("toString").kind).toBe("unknown");
  });
});

describe("section routes", () => {
  it("builds a hash-free href for each section", () => {
    expect(sectionHref("projects")).toBe("/projects");
  });

  it("reads the section back off a pathname", () => {
    expect(sectionFromPath("/projects")).toBe("projects");
    expect(sectionFromPath("/projects/")).toBe("projects");
    expect(sectionFromPath("/PROJECTS")).toBe("projects");
  });

  it("returns null for the home route and for anything unknown", () => {
    expect(sectionFromPath("/")).toBeNull();
    expect(sectionFromPath("/resume")).toBeNull();
    expect(sectionFromPath("/projects/deep")).toBeNull();
  });
});
