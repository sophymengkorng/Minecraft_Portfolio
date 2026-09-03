"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { resolveCommand } from "@/modules/portfolio/navigation";
import styles from "./CommandBar.module.css";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * The one client island on the page. Nav links and hero buttons are plain
 * anchors handled by `scroll-behavior: smooth`; only this bar needs JS, because
 * it resolves free text and supports the `top` keyword, which is not an anchor.
 */
export function CommandBar() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);

  function handleEnter() {
    const command = resolveCommand(input);
    const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";

    switch (command.kind) {
      case "noop":
        return;

      case "top":
        window.scrollTo({ top: 0, behavior });
        setInput("");
        setMessage(command.message);
        setFailed(false);
        return;

      case "section": {
        // `scroll-margin-top` on the section clears the sticky titlebar.
        document
          .getElementById(command.elementId)
          ?.scrollIntoView({ behavior, block: "start" });
        setInput("");
        setMessage(command.message);
        setFailed(false);
        return;
      }

      case "unknown":
        setMessage(command.message);
        setFailed(true);
        return;
    }
  }

  return (
    <div className={styles.bar}>
      <Container row className={styles.row}>
        <span className={styles.prompt}>
          <span className={styles.cd}>cd</span>
          <span className={styles.chevron}>&nbsp;›</span>
        </span>
        <input
          className={styles.input}
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setMessage("");
            setFailed(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleEnter();
          }}
          placeholder="try: about, skills, projects, contact, top"
          autoComplete="off"
          spellCheck={false}
          aria-label="Jump to a section"
        />
        <span
          className={`${styles.message} ${failed ? styles.error : ""}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </span>
      </Container>
    </div>
  );
}
