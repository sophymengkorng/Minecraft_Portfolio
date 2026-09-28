import {
  CanvasTexture,
  NearestFilter,
  NearestMipmapLinearFilter,
  SRGBColorSpace,
  type Texture,
} from "three";

/**
 * 16x16 block textures painted into canvases at runtime: no image requests, no
 * asset pipeline, a few KB of pixels in total. Every texture draws from a
 * seeded generator, so the world looks the same on every visit.
 */

const SIZE = 16;

export type Rand = () => number;

/** mulberry32 — small, fast, good enough for pixel noise. */
export function seeded(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Painter = (ctx: CanvasRenderingContext2D, rand: Rand) => void;

function pick<T>(items: readonly T[], rand: Rand): T {
  return items[Math.floor(rand() * items.length)] as T;
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

function noise(palette: readonly string[]): Painter {
  return (ctx, rand) => {
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) dot(ctx, x, y, pick(palette, rand));
  };
}

function toTexture(canvas: HTMLCanvasElement): Texture {
  const texture = new CanvasTexture(canvas);
  // Hard pixels up close; mipmaps keep the far faces from shimmering.
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestMipmapLinearFilter;
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function paint(seed: number, ...painters: Painter[]): Texture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d canvas unavailable");
  const rand = seeded(seed);
  for (const painter of painters) painter(ctx, rand);
  return toTexture(canvas);
}

const GRASS = ["#5d9b34", "#4f8a2b", "#6aac3c", "#5d9b34", "#78b845"] as const;
const DIRT = ["#7a5536", "#6b4a2f", "#8b6240", "#7a5536", "#5c3f27"] as const;
const STONE = ["#8a8a8a", "#7c7c7c", "#8a8a8a", "#969696", "#6f6f6f"] as const;
const BARK = ["#6b4d2e", "#5a4127", "#4a3520"] as const;
const LEAVES = ["#3b7d27", "#2f6b1f", "#4a8f30", "#255a18", "#3b7d27"] as const;
const GLOW = ["#f6d27a", "#e2a847", "#fff1b0", "#f6d27a", "#b77a2e"] as const;
const COMMAND = ["#c77b3a", "#b36a2f", "#d68b48", "#c77b3a"] as const;

const grassEdge: Painter = (ctx, rand) => {
  for (let x = 0; x < SIZE; x++) {
    const depth = 3 + Math.floor(rand() * 3);
    for (let y = 0; y < depth; y++) dot(ctx, x, y, pick(GRASS, rand));
  }
};

const barkStripes: Painter = (ctx, rand) => {
  for (let x = 0; x < SIZE; x++) {
    const base = pick(BARK, rand);
    for (let y = 0; y < SIZE; y++) dot(ctx, x, y, rand() < 0.8 ? base : pick(BARK, rand));
  }
};

const logRings: Painter = (ctx) => {
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const edge = Math.min(x, y, SIZE - 1 - x, SIZE - 1 - y);
      dot(ctx, x, y, edge === 0 ? BARK[1] : edge % 2 === 0 ? "#a8834f" : "#8d6c3e");
    }
  }
};

/** Ore specks, drawn on the colour map and, alone on black, on the glow map. */
function specks(colors: readonly string[], seed: number): { base: Painter; glow: Painter } {
  const rand = seeded(seed);
  const points: Array<[number, number, string]> = [];
  for (let cluster = 0; cluster < 5; cluster++) {
    const cx = 2 + Math.floor(rand() * 12);
    const cy = 2 + Math.floor(rand() * 12);
    for (let i = 0; i < 4; i++) {
      points.push([cx + Math.floor(rand() * 3) - 1, cy + Math.floor(rand() * 3) - 1, pick(colors, rand)]);
    }
  }
  const draw: Painter = (ctx) => points.forEach(([x, y, color]) => dot(ctx, x, y, color));
  const black: Painter = (ctx) => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, SIZE, SIZE);
  };
  return { base: draw, glow: (ctx, rand) => (black(ctx, rand), draw(ctx, rand)) };
}

/** A `>_` prompt on the command block — the one developer block in the world. */
const PROMPT: ReadonlyArray<[number, number]> = [
  [4, 5], [5, 6], [6, 7], [5, 8], [4, 9], [8, 10], [9, 10], [10, 10], [11, 10],
];
const promptGlyph = (color: string): Painter => (ctx) => PROMPT.forEach(([x, y]) => dot(ctx, x, y, color));
const frame: Painter = (ctx) => {
  ctx.strokeStyle = "#5b2f12";
  ctx.lineWidth = 1;
  ctx.strokeRect(1.5, 1.5, SIZE - 3, SIZE - 3);
};
const blank: Painter = (ctx) => {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, SIZE, SIZE);
};

const moonCraters: Painter = (ctx, rand) => {
  noise(["#e8eeff", "#dfe6fb", "#f2f5ff"])(ctx, rand);
  for (const [x, y, s] of [[3, 3, 3], [9, 5, 2], [5, 10, 2], [11, 11, 3]] as const) {
    ctx.fillStyle = "#b9c3dc";
    ctx.fillRect(x, y, s, s);
  }
};

export interface BlockTextures {
  grassTop: Texture;
  grassSide: Texture;
  dirt: Texture;
  stone: Texture;
  logSide: Texture;
  logTop: Texture;
  leaves: Texture;
  diamond: Texture;
  diamondGlow: Texture;
  gold: Texture;
  goldGlow: Texture;
  glow: Texture;
  command: Texture;
  commandGlow: Texture;
  moon: Texture;
}

export function createBlockTextures(): BlockTextures {
  const diamond = specks(["#5ee8e0", "#2cb8b0", "#d7fffc"], 11);
  const gold = specks(["#f8d23c", "#d9a820", "#fff08a"], 23);

  return {
    grassTop: paint(1, noise(GRASS)),
    grassSide: paint(2, noise(DIRT), grassEdge),
    dirt: paint(3, noise(DIRT)),
    stone: paint(4, noise(STONE)),
    logSide: paint(5, barkStripes),
    logTop: paint(6, logRings),
    leaves: paint(7, noise(LEAVES)),
    diamond: paint(8, noise(STONE), diamond.base),
    diamondGlow: paint(8, diamond.glow),
    gold: paint(9, noise(STONE), gold.base),
    goldGlow: paint(9, gold.glow),
    glow: paint(10, noise(GLOW)),
    command: paint(12, noise(COMMAND), frame, promptGlyph("#fff4d6")),
    commandGlow: paint(12, blank, promptGlyph("#ffffff")),
    moon: paint(13, moonCraters),
  };
}
