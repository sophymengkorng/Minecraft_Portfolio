import type { SectionCopy } from "@/modules/portfolio/types";
import { SplitChars } from "./SplitText";
import styles from "./SectionHeader.module.css";

/** `[01] $ cat about.md` over a pixel heading whose letters fill in as it scrolls up. */
export function SectionHeader({ copy }: { copy: SectionCopy }) {
  return (
    <header className={styles.header}>
      <div className={styles.meta}>
        <span className={styles.index}>{copy.index}</span>
        <span className={styles.kicker} data-scramble>
          {copy.kicker}
        </span>
      </div>
      <h2 className={styles.title} data-fill>
        <SplitChars lines={copy.title} accentLast={copy.title.length > 1} layout="inline" />
      </h2>
    </header>
  );
}
