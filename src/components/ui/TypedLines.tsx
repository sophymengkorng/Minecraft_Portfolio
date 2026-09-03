"use client";

import { useEffect, useRef, useState } from "react";
import {
  caretLine,
  nextTypingState,
  totalLength,
  typedPrefix,
  type TypingState,
} from "@/modules/portfolio/typing";
import { BlinkCursor } from "./BlinkCursor";
import styles from "./TypedLines.module.css";

/**
 * Types `lines` out, holds, backspaces them away, and does it again.
 *
 * The server renders the finished text, so the name is there without JS and
 * hydration has nothing to correct; the loop then starts from its hold phase
 * rather than blanking the heading the moment it mounts.
 */
export function TypedLines({ lines }: { lines: readonly string[] }) {
  const total = totalLength(lines);
  const [state, setState] = useState<TypingState>({ typed: total, phase: "typing" });
  const [running, setRunning] = useState(false);
  const frame = useRef<HTMLSpanElement>(null);

  // A loop that never ends should not run against a heading nobody is looking
  // at — off screen it freezes where it is, and picks up on the way back.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const element = frame.current;
    if (!element) return;

    const observer = new IntersectionObserver((entries) =>
      setRunning(entries.some((entry) => entry.isIntersecting)),
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;

    const next = nextTypingState(state, lines);
    const timer = window.setTimeout(() => setState(next.state), next.delay);

    return () => window.clearTimeout(timer);
  }, [running, state, lines]);

  const cursorLine = caretLine(lines, state.typed);

  return (
    <>
      <span className={styles.reader}>{lines.join(" ")}</span>
      <span ref={frame} aria-hidden="true" className={styles.lines}>
        {lines.map((line, index) => (
          <span key={line} className={styles.line}>
            <span className={styles.ghost}>{line}</span>
            <span className={styles.live}>
              {typedPrefix(lines, index, state.typed)}
              {cursorLine === index && <BlinkCursor variant="caret" color="magenta" />}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}
