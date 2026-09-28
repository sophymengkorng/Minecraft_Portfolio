import { SECTION_IDS, SECTION_ORDER } from "@/modules/portfolio/constants";
import { gsap, ScrollTrigger, SplitText } from "./gsap";

/**
 * Scroll, text and pointer behaviours, each bound to a declarative `data-*`
 * hook the server-rendered markup carries. `MotionDirector` decides which run
 * (motion preference, pointer type); each function here only knows how to
 * apply its one effect. Tweens, triggers and splits are created inside the
 * director's GSAP context, so reverting it undoes them; DOM listeners are
 * returned as cleanups.
 */

const EASE = "expo.out";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*/<>";

function all<T extends Element = HTMLElement>(selector: string): T[] {
  return gsap.utils.toArray<T>(selector);
}

/** `[data-reveal]`: fade up as it enters, in staggered batches. */
export function revealOnEnter(): void {
  const items = all("[data-reveal]");
  if (!items.length) return;

  gsap.set(items, { autoAlpha: 0, y: 40 });

  // Both directions: a jump past an element (a deep link, the command bar)
  // must not leave it hidden when the reader scrolls back up to it.
  const show = (batch: Element[]) =>
    gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.07, overwrite: true });

  ScrollTrigger.batch(items, {
    start: "top 92%",
    onEnter: show,
    onEnterBack: show,
    onLeave: show,
  });
}

/**
 * `[data-lines]`: each rendered line slides up out of its own mask.
 *
 * Line breaks depend on the viewport, so this is the one split done in the
 * browser (GSAP SplitText) rather than on the server. `autoSplit` re-splits on
 * resize and font load; returning the tween from `onSplit` lets SplitText kill
 * and rebuild it with the new lines.
 */
export function revealLines(): void {
  for (const block of all("[data-lines]")) {
    SplitText.create(block, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit: (split) =>
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.2,
          ease: EASE,
          stagger: 0.1,
          scrollTrigger: { trigger: block, start: "top 88%" },
        }),
    });
  }
}

/**
 * `[data-fill]`: text starts faded and fills in as it scrolls up the screen.
 * Headings arrive pre-split into `[data-char]` spans from the server; any
 * other element is split into words here.
 */
export function fillOnScroll(): void {
  for (const block of all("[data-fill]")) {
    const scrub = (targets: Element[]) =>
      gsap.fromTo(
        targets,
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: { trigger: block, start: "top 85%", end: "bottom 45%", scrub: true },
        },
      );

    const chars = Array.from(block.querySelectorAll("[data-char]"));
    if (chars.length) {
      scrub(chars);
      continue;
    }

    SplitText.create(block, { type: "words", autoSplit: true, onSplit: (split) => scrub(split.words) });
  }
}

function scramble(element: HTMLElement, duration: number) {
  // The resting text is the source of truth, read before any tween touches it.
  const text = (element.dataset.scrambleText ??= element.textContent ?? "");
  return gsap.to(element, {
    duration,
    ease: "none",
    overwrite: true,
    scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.6, revealDelay: 0.15 },
  });
}

/**
 * `[data-scramble]`: letters cycle through random glyphs and decode into the
 * real word as it enters. Inside a `[data-scramble-row]`, hovering the row
 * decodes it again.
 */
export function scrambleText(): () => void {
  const elements = all("[data-scramble]");

  for (const element of elements) {
    ScrollTrigger.create({
      trigger: element,
      start: "top 92%",
      once: true,
      onEnter: () => scramble(element, 1.1),
    });
  }

  const cleanups = elements.flatMap((element) => {
    const row = element.closest<HTMLElement>("[data-scramble-row]");
    if (!row) return [];

    const replay = () => scramble(element, 0.7);
    row.addEventListener("pointerenter", replay);
    return [() => row.removeEventListener("pointerenter", replay)];
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

/**
 * `[data-hotbar]`: scrolling through the hotbar's band moves the selected slot
 * across it, like the mouse wheel in the game, and the item name pops up above
 * it. Hovering a slot selects it as well. The DOM is only touched when the
 * selection actually changes, never on every scrolled frame.
 */
export function hotbar(): () => void {
  const bar = document.querySelector<HTMLElement>("[data-hotbar]");
  const name = bar?.querySelector<HTMLElement>("[data-hotbar-name]");
  const slots = bar ? Array.from(bar.querySelectorAll<HTMLElement>("[data-hotbar-slot]")) : [];
  if (!bar || !name || !slots.length) return () => {};

  let selected = 0;
  const select = (index: number) => {
    if (index === selected) return;
    slots[selected]?.removeAttribute("data-selected");
    slots[index]?.setAttribute("data-selected", "");
    selected = index;
    name.textContent = slots[index]?.dataset.hotbarSlot ?? "";
    gsap.fromTo(name, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "back.out(3)", overwrite: true });
  };

  ScrollTrigger.create({
    trigger: bar,
    start: "top 85%",
    end: "bottom 15%",
    onUpdate: ({ progress }) => select(Math.min(slots.length - 1, Math.floor(progress * slots.length))),
  });

  const cleanups = slots.map((slot, index) => {
    const hover = () => select(index);
    slot.addEventListener("pointerenter", hover);
    return () => slot.removeEventListener("pointerenter", hover);
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

/**
 * `[data-pop]`: items pop into their slots one after another, with a little
 * overshoot, the first time their container scrolls in — like picking them up.
 */
export function popIn(): void {
  const items = all("[data-pop]");
  if (!items.length) return;

  gsap.from(items, {
    scale: 0,
    autoAlpha: 0,
    duration: 0.45,
    ease: "back.out(2.2)",
    stagger: 0.045,
    // A jump past the panel (a deep link, chat `tp`) still fires onEnter, so
    // the slots never stay hidden.
    scrollTrigger: { trigger: items[0], start: "top 90%", toggleActions: "play none none none" },
  });
}

/** The hero copy drifts up and fades as the hero scrolls out. */
export function heroOutro(): void {
  const content = document.querySelector("[data-hero-content]");
  const hero = content?.closest("section");
  if (!content || !hero) return;

  gsap.to(content, {
    yPercent: -18,
    autoAlpha: 0,
    ease: "none",
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom 15%", scrub: true },
  });
}

/** `[data-scroll-progress]`: a bar that fills with overall page progress. */
export function scrollProgress(): void {
  const bar = document.querySelector("[data-scroll-progress]");
  if (!bar) return;

  gsap.fromTo(
    bar,
    { scaleX: 0 },
    { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } },
  );
}

/** `[data-nav-link]`: mark the link for whichever section holds mid-screen. */
export function activeNavLink(): void {
  for (const section of SECTION_ORDER) {
    const band = document.getElementById(SECTION_IDS[section]);
    const link = document.querySelector(`[data-nav-link="${section}"]`);
    if (!band || !link) continue;

    ScrollTrigger.create({
      trigger: band,
      start: "top 50%",
      end: "bottom 50%",
      onToggle: ({ isActive }) =>
        isActive ? link.setAttribute("aria-current", "location") : link.removeAttribute("aria-current"),
    });
  }
}

/**
 * `[data-xp-level]`: the XP bar's level is the section you are in — 0 on the
 * hero, 1–4 after. Only written when it changes, never per scrolled frame.
 */
export function xpLevel(): void {
  const label = document.querySelector("[data-xp-level]");
  if (!label) return;

  const show = (level: number) => {
    const text = String(level);
    if (label.textContent !== text) label.textContent = text;
  };

  SECTION_ORDER.forEach((section, index) => {
    const band = document.getElementById(SECTION_IDS[section]);
    if (!band) return;

    ScrollTrigger.create({
      trigger: band,
      start: "top 50%",
      onEnter: () => show(index + 1),
      onLeaveBack: () => show(index),
    });
  });
}

/** `[data-magnetic]`: the element leans toward the pointer while hovered. */
export function magnetic(): () => void {
  const cleanups = all("[data-magnetic]").map((element) => {
    const toX = gsap.quickTo(element, "x", { duration: 0.6, ease: "power3" });
    const toY = gsap.quickTo(element, "y", { duration: 0.6, ease: "power3" });

    const move = (event: PointerEvent) => {
      const box = element.getBoundingClientRect();
      toX((event.clientX - (box.left + box.width / 2)) * 0.3);
      toY((event.clientY - (box.top + box.height / 2)) * 0.4);
    };
    const leave = () => {
      toX(0);
      toY(0);
    };

    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    return () => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
    };
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}
