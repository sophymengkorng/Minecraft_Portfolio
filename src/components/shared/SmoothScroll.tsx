"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/modules/motion/gsap";
import { lenisScroller, nativeScroller, type Scroller } from "@/modules/portfolio/scroll";

const ScrollerContext = createContext<Scroller>(nativeScroller);

/** The page's scroller — Lenis when smooth scrolling is on, native otherwise. */
export function useScroller(): Scroller {
  return useContext(ScrollerContext);
}

/**
 * Owns the one Lenis instance for the page and hands it out through context
 * rather than a module global. Lenis runs on GSAP's ticker, so the smoothed
 * scroll and every ScrollTrigger advance in the same frame instead of two
 * rAF loops drifting a frame apart.
 *
 * The context value is a stable proxy: children's effects run before this
 * one, so the section router's landing jump fires while the native adapter is
 * still in place, and later calls reach Lenis without anyone re-subscribing.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const driver = useRef<Scroller>(nativeScroller);
  const [scroller] = useState<Scroller>(() => ({
    toElement: (element, immediate) => driver.current.toElement(element, immediate),
    toTop: (immediate) => driver.current.toTop(immediate),
  }));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: false, lerp: 0.09 });
    const tick = (seconds: number) => lenis.raf(seconds * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    driver.current = lenisScroller(lenis);

    return () => {
      driver.current = nativeScroller;
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return <ScrollerContext value={scroller}>{children}</ScrollerContext>;
}
