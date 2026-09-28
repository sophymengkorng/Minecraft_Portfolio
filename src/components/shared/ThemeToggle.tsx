"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@/components/ui/Icons";
import { readTheme, switchTheme, watchTheme } from "@/modules/theme/dom";
import { nextTheme, type Theme } from "@/modules/theme/theme";
import styles from "./ThemeToggle.module.css";

// The server cannot know the theme, so it renders `null` and React swaps in
// the real value right after hydration — no mismatch, no flash (the icons
// themselves are chosen by CSS from `data-theme`, which is right from paint).
const subscribe = (onChange: () => void) => watchTheme(onChange);
const getServerSnapshot = (): Theme | null => null;

/** Day ⇄ night. Both icons are always rendered; CSS shows the right one. */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, getServerSnapshot);

  return (
    <button
      type="button"
      className={styles.toggle}
      aria-label="Night mode"
      aria-pressed={theme === null ? undefined : theme === "dark"}
      onClick={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        switchTheme(nextTheme(readTheme()), { x: box.left + box.width / 2, y: box.top + box.height / 2 });
      }}
    >
      <SunIcon className={styles.sun} />
      <MoonIcon className={styles.moon} />
    </button>
  );
}
