import { describe, expect, it } from "vitest";
import { generateIsland } from "@/modules/scene/world";

describe("generateIsland", () => {
  it("is deterministic for a given seed", () => {
    expect(generateIsland(6, 3)).toEqual(generateIsland(6, 3));
  });

  it("culls buried blocks and keeps the surface", () => {
    const island = generateIsland(7);
    const visible = [...island.visible.values()].reduce((sum, list) => sum + list.length, 0);

    expect(visible).toBeLessThan(island.total);
    expect(island.visible.get("grass")?.length).toBeGreaterThan(50);
    expect(island.visible.get("command")).toHaveLength(1);
  });
});
