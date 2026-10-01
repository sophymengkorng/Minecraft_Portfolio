import { describe, expect, it } from "vitest";
import { isTheme, nextTheme, resolveTheme, THEME_BOOT_SCRIPT } from "@/modules/theme/theme";

describe("resolveTheme", () => {
  it("prefers a stored choice over the OS setting", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("falls back to the OS setting when nothing valid is stored", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
    expect(resolveTheme("sepia", true)).toBe("dark");
  });
});

describe("theme helpers", () => {
  it("toggles between the two themes", () => {
    expect(nextTheme("light")).toBe("dark");
    expect(nextTheme("dark")).toBe("light");
  });

  it("only accepts the two known themes", () => {
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("constructor")).toBe(false);
    expect(isTheme(undefined)).toBe(false);
  });

  it("boot script is a self-contained expression", () => {
    expect(() => new Function(THEME_BOOT_SCRIPT)).not.toThrow();
  });
});
