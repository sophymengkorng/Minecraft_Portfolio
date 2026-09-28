import { describe, expect, it } from "vitest";
import { SKILL_GROUPS } from "@/modules/portfolio/content";
import { luminance, skillIcon } from "@/modules/portfolio/skillIcons";

describe("skillIcon", () => {
  it("has a logo for every listed skill", () => {
    for (const item of SKILL_GROUPS.flatMap((group) => group.items)) {
      expect(skillIcon(item), item).not.toBeNull();
    }
  });

  it("draws near-black brands in white so they show on dark slots", () => {
    expect(skillIcon("Next.js")?.color).toBe("#ffffff");
    expect(skillIcon("GitHub")?.color).toBe("#ffffff");
    expect(skillIcon("Laravel")?.color).toBe("#FF2D20");
  });

  it("returns null for unknown names, including inherited keys", () => {
    expect(skillIcon("COBOL")).toBeNull();
    expect(skillIcon("constructor")).toBeNull();
  });
});

describe("luminance", () => {
  it("spans black to white", () => {
    expect(luminance("000000")).toBe(0);
    expect(luminance("FFFFFF")).toBeCloseTo(1);
  });
});
