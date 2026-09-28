"use client";

import { useEffect, useRef, useState } from "react";
import { resolveCommand } from "@/modules/portfolio/navigation";
import { navigateToSection, navigateToTop } from "@/modules/portfolio/scroll";
import { switchTheme } from "@/modules/theme/dom";
import { useScroller } from "./SmoothScroll";
import styles from "./CommandBar.module.css";

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

/**
 * Minecraft chat, as a command line. `/tp projects` lands on the same route a
 * click on the nav does — both go through `scroll.ts`, so the address bar and
 * the scroll position never disagree. It also takes `spawn` (the top) and
 * `/time set night`, which no link points at. `/` focuses it from anywhere on
 * the page, exactly as it opens chat in the game.
 */
export function CommandBar() {
  const scroller = useScroller();
  const field = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      event.preventDefault();
      field.current?.focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleEnter() {
    const command = resolveCommand(input);

    switch (command.kind) {
      case "noop":
        return;

      case "top":
        navigateToTop(scroller);
        setInput("");
        setMessage(command.message);
        setFailed(false);
        return;

      case "section":
        navigateToSection(scroller, command.section);
        setInput("");
        setMessage(command.message);
        setFailed(false);
        return;

      case "theme":
        switchTheme(command.theme);
        setInput("");
        setMessage(command.message);
        setFailed(false);
        return;

      case "unknown":
        setMessage(command.message);
        setFailed(true);
        return;
    }
  }

  return (
    <div className={styles.bar}>
      <span className={styles.prompt} aria-hidden="true">
        /
      </span>
      <input
        ref={field}
        className={styles.input}
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
          setMessage("");
          setFailed(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") handleEnter();
          if (event.key === "Escape") event.currentTarget.blur();
        }}
        placeholder="tp projects · time set night"
        autoComplete="off"
        spellCheck={false}
        aria-label="Command: tp to a section, or time set day or night"
      />
      {/* Keyed on the text so a repeated command replays the fade. */}
      <span className={styles.log} role="status" aria-live="polite">
        {message && (
          <span key={message + failed} className={`${styles.message} ${failed ? styles.error : ""}`}>
            {message}
          </span>
        )}
      </span>
      <kbd className={styles.kbd} aria-hidden="true">
        /
      </kbd>
    </div>
  );
}
