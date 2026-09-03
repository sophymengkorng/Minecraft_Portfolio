import { describe, expect, it } from "vitest";
import { normalizeCommand, resolveCommand } from "@/modules/portfolio/navigation";

describe("normalizeCommand", () => {
  it("trims, lowercases, and strips cd / ./ / trailing slash", () => {
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

  it.each(["top", "~", "home", "cd ~"])("scrolls to the top for %s", (input) => {
    expect(resolveCommand(input)).toEqual({ kind: "top", message: "→ top" });
  });

  it.each([
    ["about", "b-about"],
    ["skills", "b-skills"],
    ["projects", "b-projects"],
    ["contact", "b-contact"],
  ])("resolves %s to #%s", (input, elementId) => {
    expect(resolveCommand(input)).toEqual({
      kind: "section",
      section: input,
      elementId,
      message: `→ /${input}`,
    });
  });

  it("reports unknown directories without scrolling", () => {
    expect(resolveCommand("resume")).toEqual({
      kind: "unknown",
      message: "no such directory: resume",
    });
  });

  it("does not resolve inherited Object.prototype keys as sections", () => {
    expect(resolveCommand("constructor").kind).toBe("unknown");
    expect(resolveCommand("toString").kind).toBe("unknown");
  });
});
