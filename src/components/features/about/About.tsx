import { Kicker } from "@/components/ui/Kicker";
import { Section } from "@/components/ui/Section";
import { SECTION_IDS } from "@/modules/portfolio/constants";
import { ABOUT_META, IDENTITY } from "@/modules/portfolio/content";
import styles from "./About.module.css";

export function About() {
  return (
    <Section id={SECTION_IDS.about}>
      <Kicker>$ cat about.md</Kicker>
      <div className={styles.grid}>
        <p className={styles.bio}>{IDENTITY.bio}</p>
        <dl className={styles.meta}>
          {ABOUT_META.map((row) => (
            <div key={row.label} className={styles.row}>
              <dt className={styles.label}>{row.label}</dt>
              <dd className={row.accent ? styles.accent : undefined}>
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
