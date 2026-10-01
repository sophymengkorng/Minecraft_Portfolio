"use client";

import { useState } from "react";
import styles from "./Hero.module.css";

/**
 * The yellow title-screen splash. The server renders the first line, so there
 * is nothing to swap on hydration; a click shows the next one, and the key
 * change replays the pop-in.
 */
export function Splash({ lines }: { lines: readonly string[] }) {
  const [index, setIndex] = useState(0);

  return (
    <button type="button" className={styles.splash} onClick={() => setIndex((index + 1) % lines.length)}>
      <span key={index} className={styles.splashText}>
        {lines[index]}
      </span>
    </button>
  );
}
