import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  InstancedMesh,
  type Material,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { createBlockTextures, seeded } from "./textures";
import { type BlockId, generateIsland } from "./world";

/**
 * The hero's WebGL scene: a floating voxel island under a sun, a moon, stars
 * and drifting block clouds. Plain three.js behind a small imperative handle —
 * `HeroScene` owns the lifecycle (ticker, visibility, resize, input, theme) and
 * this module owns the GPU.
 *
 * Kept cheap on purpose: one InstancedMesh per block type with buried blocks
 * culled, Lambert shading, no shadows, no post-processing, no per-frame
 * allocation, and a capped pixel ratio.
 */
export interface VoxelScene {
  /** Advance by `dt` seconds and draw. */
  frame(dt: number): void;
  /** Draw without advancing (paused loop, resize, theme tween while off screen). */
  render(): void;
  resize(width: number, height: number): void;
  /** Pointer position, each axis normalized to -1..1. */
  setPointer(x: number, y: number): void;
  /** 0 with the hero fully in view, 1 once it has scrolled away. */
  setScroll(progress: number): void;
  /** 0 is noon, 1 is midnight; everything in between is a blend. */
  setNight(amount: number): void;
  dispose(): void;
}

const FOV = 35;
const TILT = 0.34; // camera height as a fraction of its distance

// Day → night, blended in `setNight`.
const SKY = { day: new Color("#ffffff"), night: new Color("#6a7fc0") };
const GROUND = { day: new Color("#b59a6a"), night: new Color("#1b1a2e") };
const SUN = { day: new Color("#fff1d6"), night: new Color("#a9bcff") };
const CLOUD = { day: new Color("#ffffff"), night: new Color("#7d88ab") };
const LIGHT_DAY = new Vector3(8, 14, 9);
const LIGHT_NIGHT = new Vector3(-9, 11, 6);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

export function createVoxelScene(canvas: HTMLCanvasElement, { dense }: { dense: boolean }): VoxelScene {
  // Throws when WebGL is unavailable; the caller treats that as "no scene".
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
  const pixelRatio = Math.min(window.devicePixelRatio, dense ? 1.75 : 1.5);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 200);
  const textures = createBlockTextures();

  // --- materials -------------------------------------------------------------
  const lambert = (map = textures.stone, glow?: typeof map) =>
    new MeshLambertMaterial({ map, ...(glow ? { emissiveMap: glow, emissive: new Color("#ffffff"), emissiveIntensity: 0 } : {}) });

  const grassSide = lambert(textures.grassSide);
  const logSide = lambert(textures.logSide);
  const logTop = lambert(textures.logTop);
  const glowing = {
    diamond: lambert(textures.diamond, textures.diamondGlow),
    gold: lambert(textures.gold, textures.goldGlow),
    glow: lambert(textures.glow, textures.glow),
    command: lambert(textures.command, textures.commandGlow),
  };

  // BoxGeometry face order: +x, -x, +y, -y, +z, -z. A single material draws
  // the box in one call; an array costs one call per face group.
  const materials: Record<BlockId, Material | Material[]> = {
    grass: [grassSide, grassSide, lambert(textures.grassTop), lambert(textures.dirt), grassSide, grassSide],
    dirt: lambert(textures.dirt),
    stone: lambert(textures.stone),
    log: [logSide, logSide, logTop, logTop, logSide, logSide],
    leaves: lambert(textures.leaves),
    ...glowing,
  };

  // --- the island --------------------------------------------------------------
  const radius = dense ? 7 : 5.5;
  const island = generateIsland(radius);
  const cube = new BoxGeometry(1, 1, 1);
  const world = new Group();
  const matrix = new Matrix4();

  for (const [block, voxels] of island.visible) {
    const mesh = new InstancedMesh(cube, materials[block], voxels.length);
    voxels.forEach(([x, y, z], i) => mesh.setMatrixAt(i, matrix.makeTranslation(x, y, z)));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
    world.add(mesh);
  }
  // Sit the grass line a little above the rig's origin.
  world.position.y = -1;

  // Dropped items: small blocks bobbing and spinning around the shore.
  const items = (["diamond", "command", "gold", "grass"] as const).map((block, i) => {
    const item = new Mesh(cube, materials[block]);
    const angle = (i / 4) * Math.PI * 2 + 0.6;
    item.scale.setScalar(0.42);
    item.position.set(Math.cos(angle) * (radius + 1.6), 1.2 + (i % 2) * 0.8, Math.sin(angle) * (radius + 1.6));
    item.userData.baseY = item.position.y;
    return item;
  });

  // Pointer tilt goes on `tilt`; spin, layout offset and scroll lift on `rig`.
  const tilt = new Group();
  tilt.add(world, ...items);
  const rig = new Group();
  rig.add(tilt);

  // --- sky ---------------------------------------------------------------------
  const rand = seeded(99);
  const cloudMaterial = new MeshLambertMaterial({ color: CLOUD.day.clone(), transparent: true, opacity: 0.9 });
  const clouds = new InstancedMesh(cube, cloudMaterial, dense ? 14 : 8);
  const cloudState = Array.from({ length: clouds.count }, () => ({
    x: rand() * 60 - 30,
    y: 7 + rand() * 4,
    z: -14 + rand() * 16,
    w: 3 + Math.floor(rand() * 5),
    d: 2 + Math.floor(rand() * 3),
    speed: 0.5 + rand() * 0.6,
  }));
  const cloudBox = new Object3D();

  const starCount = dense ? 520 : 260;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(rand() * 0.9); // upper hemisphere, mostly
    starPositions.set(
      [Math.sin(phi) * Math.cos(theta) * 90, Math.cos(phi) * 70 - 8, -Math.abs(Math.sin(phi) * Math.sin(theta) * 90) - 20],
      i * 3,
    );
  }
  const starGeometry = new BufferGeometry();
  starGeometry.setAttribute("position", new BufferAttribute(starPositions, 3));
  // Size in pixels, no attenuation: square pixel stars at any distance.
  const starMaterial = new PointsMaterial({ color: "#ffffff", size: 2.4 * pixelRatio, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false });
  const stars = new Points(starGeometry, starMaterial);

  // The sun and moon are squares, on opposite ends of one arm. Night swings the arm.
  const square = new PlaneGeometry(1, 1);
  const sunMaterial = new MeshBasicMaterial({ color: "#fff3a0", transparent: true });
  const haloMaterial = new MeshBasicMaterial({ color: "#fff3a0", transparent: true, opacity: 0.22, depthWrite: false });
  const moonMaterial = new MeshBasicMaterial({ map: textures.moon, transparent: true, opacity: 0 });
  const sun = new Mesh(square, sunMaterial);
  const halo = new Mesh(square, haloMaterial);
  const moon = new Mesh(square, moonMaterial);
  sun.scale.setScalar(5.2);
  halo.scale.setScalar(8.6);
  halo.position.z = -0.1;
  moon.scale.setScalar(4.6);
  // The camera looks down at the island, so the "high" sky sits low in world
  // space. Whichever body is under the horizon fades out as it sets.
  const arm = 13;
  sun.position.y = arm;
  halo.position.y = arm;
  moon.position.y = -arm;
  const celestial = new Group();
  celestial.add(sun, halo, moon);
  celestial.position.set(0, -9, -45);
  celestial.rotation.z = 0.35;

  const sky = new Group();
  sky.add(stars, celestial, clouds);

  // --- light -------------------------------------------------------------------
  const hemi = new HemisphereLight(SKY.day, GROUND.day, 1.6);
  const key = new DirectionalLight(SUN.day, 2.1);
  key.position.copy(LIGHT_DAY);

  scene.add(sky, rig, hemi, key);

  // --- state -------------------------------------------------------------------
  const pointer = { x: 0, y: 0 };
  let scrollTarget = 0;
  let scroll = 0;
  let elapsed = 0;
  let baseX = 0;
  let baseY = 0;

  function placeClouds(dt: number) {
    cloudState.forEach((c, i) => {
      c.x += c.speed * dt;
      if (c.x > 34) c.x = -34;
      cloudBox.position.set(c.x, c.y, c.z);
      cloudBox.scale.set(c.w, 0.6, c.d);
      cloudBox.updateMatrix();
      clouds.setMatrixAt(i, cloudBox.matrix);
    });
    clouds.instanceMatrix.needsUpdate = true;
  }
  placeClouds(0);
  clouds.computeBoundingSphere();
  // Clouds wrap across the whole sky; a bounding sphere from one frame would cull them.
  clouds.frustumCulled = false;

  function update(dt: number) {
    elapsed += dt;
    scroll += (scrollTarget - scroll) * Math.min(1, dt * 6);

    rig.rotation.y += dt * 0.12;
    const ease = Math.min(1, dt * 2.5);
    tilt.rotation.y += (pointer.x * 0.35 - tilt.rotation.y) * ease;
    tilt.rotation.x += (pointer.y * 0.16 - tilt.rotation.x) * ease;
    rig.position.set(baseX, baseY + scroll * 4, 0);
    rig.rotation.x = scroll * 0.5;

    items.forEach((item, i) => {
      item.rotation.y += dt * 1.1;
      item.position.y = item.userData.baseY + Math.sin(elapsed * 2 + i * 1.7) * 0.18;
    });

    placeClouds(dt);
    stars.rotation.z = elapsed * 0.004;
  }

  return {
    frame(dt) {
      // Clamped: a long gap (a background tab) must not teleport everything.
      update(Math.min(dt, 0.05));
      renderer.render(scene, camera);
    },
    render() {
      renderer.render(scene, camera);
    },
    resize(width, height) {
      if (!width || !height) return;
      const aspect = width / height;
      const tan = Math.tan((FOV / 2) * (Math.PI / 180));
      // Wide screens: the island sits right of the copy. Narrow: centred and
      // low, pulled back far enough that it still fits the width.
      const wide = aspect >= 1.05;
      const distance = wide ? 37 : Math.max(34, (radius + 3) / (tan * aspect));
      const halfHeight = distance * tan;

      renderer.setSize(width, height, false);
      camera.aspect = aspect;
      camera.position.set(0, distance * TILT, distance);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();

      baseX = wide ? Math.min(halfHeight * aspect * 0.46, 16) : 0;
      baseY = wide ? 0 : -halfHeight * 0.42;
      rig.position.set(baseX, baseY + scroll * 4, 0);
      // Sun and moon hang up and to the right of the island (at the right
      // edge on narrow screens), clear of the copy. They are far back, so
      // their x is scaled by depth to land where it should on screen.
      const depth = distance - celestial.position.z;
      const skyX = wide ? baseX + radius * 0.9 : halfHeight * aspect * 0.9;
      celestial.position.x = (skyX / distance) * depth;
    },
    setPointer(x, y) {
      pointer.x = x;
      pointer.y = y;
    },
    setScroll(progress) {
      scrollTarget = Math.min(1, Math.max(0, progress));
    },
    setNight(amount) {
      const t = Math.min(1, Math.max(0, amount));
      hemi.color.lerpColors(SKY.day, SKY.night, t);
      hemi.groundColor.lerpColors(GROUND.day, GROUND.night, t);
      hemi.intensity = lerp(1.6, 0.55, t);
      key.color.lerpColors(SUN.day, SUN.night, t);
      key.intensity = lerp(2.1, 0.45, t);
      key.position.lerpVectors(LIGHT_DAY, LIGHT_NIGHT, t);

      glowing.diamond.emissiveIntensity = t * 0.9;
      glowing.gold.emissiveIntensity = t * 0.7;
      glowing.glow.emissiveIntensity = 0.25 + t * 1.1;
      glowing.command.emissiveIntensity = 0.15 + t * 0.9;

      cloudMaterial.color.lerpColors(CLOUD.day, CLOUD.night, t);
      cloudMaterial.opacity = lerp(0.9, 0.55, t);
      starMaterial.opacity = smooth(0.35, 1, t);
      celestial.rotation.z = 0.35 + t * Math.PI;
      sunMaterial.opacity = 1 - smooth(0.3, 0.75, t);
      haloMaterial.opacity = 0.22 * sunMaterial.opacity;
      moonMaterial.opacity = smooth(0.25, 0.7, t);
    },
    dispose() {
      const disposed = new Set<{ dispose(): void }>();
      scene.traverse((object) => {
        if (object instanceof Mesh || object instanceof Points) {
          disposed.add(object.geometry);
          for (const material of [object.material].flat()) disposed.add(material);
        }
      });
      for (const texture of Object.values(textures)) disposed.add(texture);
      for (const resource of disposed) resource.dispose();
      renderer.dispose();
      // Free the context now rather than at GC: remounts (dev strict mode,
      // fast refresh) would otherwise stack live contexts toward the limit.
      renderer.forceContextLoss();
    },
  };
}
