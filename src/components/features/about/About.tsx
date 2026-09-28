import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SECTION_IDS } from "@/modules/portfolio/constants";
import { ABOUT_META, DEBUG_TITLE, IDENTITY, SECTION_COPY } from "@/modules/portfolio/content";
import styles from "./About.module.css";

/**
 * The bio as one statement, then the pitch beside an F3 debug screen that
 * holds the facts (focus, editor, os) the way the game lists coordinates.
 */
export function About() {
  return (
    <Section id={SECTION_IDS.about} copy={SECTION_COPY.about}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.text}>
            {/* Fills in word by word as it scrolls up the screen. */}
            <p className={styles.statement} data-fill>
              {IDENTITY.bio}
            </p>
            {/* Slides up line by line as it enters. */}
            <p className={styles.pitch} data-lines>
              {IDENTITY.pitch}
            </p>
          </div>
          <div className={styles.debug} data-reveal>
            <p className={styles.debugTitle}>
              <span>{DEBUG_TITLE}</span>
              <kbd className={styles.key}>F3</kbd>
            </p>
            <dl className={styles.meta}>
              {ABOUT_META.map((row) => (
                <div key={row.label} className={styles.row}>
                  <dt className={styles.label}>{row.label}:</dt>
                  <dd className={`${styles.value} ${row.accent ? styles.accent : ""}`}>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </Section>
  );
}
