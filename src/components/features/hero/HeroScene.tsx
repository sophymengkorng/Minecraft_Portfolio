"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/modules/motion/gsap";
import type { VoxelScene } from "@/modules/scene/voxel";
import { readTheme, watchTheme } from "@/modules/theme/dom";
import styles from "./Hero.module.css";

const nightOf = (theme: string) => (theme === "dark" ? 1 : 0);

/**
 * Mounts the voxel island behind the hero. three.js is pulled in with a
 * dynamic `import()`, so it never sits in the page's main bundle or delays
 * first paint.
 *
 * Frames come from GSAP's ticker — the same one Lenis and ScrollTrigger run on
 * — so the page has one rAF loop, not three drifting a frame apart. The ticker
 * callback is attached only while the hero is on screen and the tab visible.
 * Switching theme tweens the sky from noon to midnight (or back) rather than
 * cutting; with reduced motion it cuts, and the scene renders still frames.
 */
export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];
    let unmounted = false;

    import("@/modules/scene/voxel")
      .then(({ createVoxelScene }) => {
        if (unmounted) return;

        let scene: VoxelScene;
        try {
          scene = createVoxelScene(canvas, {
            dense: window.innerWidth > 900 && (navigator.hardwareConcurrency ?? 4) > 4,
          });
        } catch {
          // A10: no WebGL is an expected condition, not an error. The hero's
          // CSS sky is the designed fallback, so this fails to "no island".
          return;
        }
        cleanups.push(() => scene.dispose());

        let running = false;
        const sky = { night: nightOf(readTheme()) };
        scene.setNight(sky.night);

        // Resizing clears the canvas; repaint at once so a paused loop never
        // leaves it blank.
        const resize = () => {
          scene.resize(host.clientWidth, host.clientHeight);
          if (!running) scene.render();
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);
        cleanups.push(() => resizeObserver.disconnect());
        resize();

        cleanups.push(
          watchTheme((theme) => {
            gsap.to(sky, {
              night: nightOf(theme),
              duration: reduceMotion ? 0 : 1.6,
              ease: "power2.inOut",
              overwrite: true,
              onUpdate: () => {
                scene.setNight(sky.night);
                if (!running) scene.render();
              },
            });
          }),
          () => gsap.killTweensOf(sky),
        );

        canvas.dataset.ready = "";
        if (reduceMotion) return;

        const tick = (_time: number, deltaMs: number) => scene.frame(deltaMs / 1000);
        let onScreen = true;
        const sync = () => {
          const shouldRun = onScreen && !document.hidden;
          if (shouldRun === running) return;
          running = shouldRun;
          if (running) gsap.ticker.add(tick);
          else gsap.ticker.remove(tick);
        };

        const visibility = new IntersectionObserver((entries) => {
          onScreen = entries.some((entry) => entry.isIntersecting);
          sync();
        });
        visibility.observe(host);
        document.addEventListener("visibilitychange", sync);

        const onPointer = (event: PointerEvent) =>
          scene.setPointer(
            (event.clientX / window.innerWidth) * 2 - 1,
            (event.clientY / window.innerHeight) * 2 - 1,
          );
        const onScroll = () => scene.setScroll(window.scrollY / Math.max(1, host.offsetHeight));

        window.addEventListener("pointermove", onPointer, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        sync();

        cleanups.push(() => {
          visibility.disconnect();
          document.removeEventListener("visibilitychange", sync);
          window.removeEventListener("pointermove", onPointer);
          window.removeEventListener("scroll", onScroll);
          gsap.ticker.remove(tick);
        });
      })
      // The chunk failed to load: same outcome as no WebGL — the CSS sky.
      .catch(() => {});

    return () => {
      unmounted = true;
      // Reverse order: listeners come off before the renderer is disposed.
      for (const cleanup of cleanups.reverse()) cleanup();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
