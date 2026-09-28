import { seeded } from "./textures";

/**
 * The floating island, as plain data: which block sits at which integer
 * coordinate. No three.js here, so the generator is unit-testable and the
 * scene module only has to turn the result into instanced meshes.
 */

export type BlockId =
  | "grass"
  | "dirt"
  | "stone"
  | "log"
  | "leaves"
  | "diamond"
  | "gold"
  | "glow"
  | "command";

export type Voxel = readonly [x: number, y: number, z: number];

export interface Island {
  /** Only blocks with at least one face open to the air — the rest are never seen. */
  readonly visible: ReadonlyMap<BlockId, readonly Voxel[]>;
  /** Every block, including buried ones. */
  readonly total: number;
}

const key = (x: number, y: number, z: number) => `${x},${y},${z}`;

const NEIGHBOURS: readonly Voxel[] = [
  [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
];

export function generateIsland(radius: number, seed = 7): Island {
  const rand = seeded(seed);
  const world = new Map<string, BlockId>();
  const surface = new Map<string, number>();
  const set = (x: number, y: number, z: number, block: BlockId) => world.set(key(x, y, z), block);

  const r = Math.ceil(radius) + 1;
  for (let x = -r; x <= r; x++) {
    for (let z = -r; z <= r; z++) {
      const d = Math.hypot(x, z);
      // A ragged shoreline rather than a perfect disc.
      const edge = radius + Math.sin(x * 1.3 + z * 0.7) * 0.6 + Math.cos(z * 1.1 - x * 0.4) * 0.5;
      if (d > edge) continue;

      const inner = 1 - d / edge;
      const top = Math.round(inner * 2.2 + Math.sin(x * 0.8) * Math.cos(z * 0.9) * 0.9);
      // The underside tapers to a rough point, deepest in the middle.
      const bottom = top - 2 - Math.round(inner * radius * 1.15 + rand() * 1.5);

      surface.set(`${x},${z}`, top);
      set(x, top, z, "grass");
      for (let y = top - 1; y >= bottom; y--) {
        if (y >= top - 2) set(x, y, z, "dirt");
        else {
          const roll = rand();
          set(x, y, z, roll < 0.05 ? "diamond" : roll < 0.1 ? "gold" : "stone");
        }
      }
    }
  }

  const ground = (x: number, z: number) => surface.get(`${x},${z}`);

  function tree(x: number, z: number, height: number) {
    const base = ground(x, z);
    if (base === undefined) return;
    const crown = base + height;
    for (let y = base + 1; y <= crown; y++) set(x, y, z, "log");
    for (let dy = -1; dy <= 1; dy++) {
      const spread = dy === 1 ? 1 : 2;
      for (let dx = -spread; dx <= spread; dx++) {
        for (let dz = -spread; dz <= spread; dz++) {
          const corner = Math.abs(dx) === spread && Math.abs(dz) === spread;
          if ((dx === 0 && dz === 0 && dy < 1) || (corner && rand() < 0.6)) continue;
          set(x + dx, crown + dy, z + dz, "leaves");
        }
      }
    }
    set(x, crown + 2, z, "leaves");
  }

  function place(x: number, z: number, block: BlockId) {
    const base = ground(x, z);
    if (base !== undefined) set(x, base + 1, z, block);
  }

  const s = radius / 7;
  tree(Math.round(-2 * s), Math.round(-2 * s), 4);
  tree(Math.round(3 * s), Math.round(-3 * s), 3);
  place(Math.round(2 * s), Math.round(2 * s), "command");
  place(Math.round(-4 * s), Math.round(2 * s), "glow");
  place(Math.round(4 * s), Math.round(-0.5 * s), "glow");

  const visible = new Map<BlockId, Voxel[]>();
  for (const [position, block] of world) {
    const [x, y, z] = position.split(",").map(Number) as [number, number, number];
    const exposed =
      block === "leaves" || NEIGHBOURS.some(([dx, dy, dz]) => !world.has(key(x + dx, y + dy, z + dz)));
    if (!exposed) continue;

    const list = visible.get(block) ?? [];
    list.push([x, y, z]);
    visible.set(block, list);
  }

  return { visible, total: world.size };
}
