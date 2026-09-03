import { Kicker } from "@/components/ui/Kicker";
import { Pill } from "@/components/ui/Pill";
import { Section } from "@/components/ui/Section";
import { SECTION_IDS } from "@/modules/portfolio/constants";
import { SKILL_GROUPS } from "@/modules/portfolio/content";
import styles from "./Skills.module.css";

export function Skills() {
  return (
    <Section id={SECTION_IDS.skills}>
      <Kicker gap="wide">$ ls ./skills</Kicker>
      <div className={styles.grid}>
        {SKILL_GROUPS.map((group) => (
          <div key={group.heading}>
            <h2 className={styles.heading}>{group.heading}</h2>
            <div className={styles.pills}>
              {group.items.map((item) => (
                <Pill key={item}>{item}</Pill>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
