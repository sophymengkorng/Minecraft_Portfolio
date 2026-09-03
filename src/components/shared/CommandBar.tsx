"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { resolveCommand } from "@/modules/portfolio/navigation";
import { navigateToSection, navigateToTop } from "@/modules/portfolio/scroll";
import styles from "./CommandBar.module.css";

/**
 * `cd projects` lands on the same route a click on the nav does — both go
 * through `scroll.ts`, so the address bar and the scroll position never
 * disagree. This bar exists because it resolves free text and supports `top`,
 * which no link points at.
 */
export function CommandBar() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);

  function handleEnter() {
    const command = resolveCommand(input);

    switch (command.kind) {
      case "noop":
        return;

      case "top":
        navigateToTop();
        setInput("");
        setMessage(command.message);
        setFailed(false);
        return;

      case "section":
        navigateToSection(command.section);
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
