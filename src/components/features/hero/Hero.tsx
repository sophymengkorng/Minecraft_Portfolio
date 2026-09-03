import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { PixelButton } from "@/components/ui/PixelButton";
import { SECTION_IDS } from "@/modules/portfolio/constants";
import { IDENTITY } from "@/modules/portfolio/content";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <Container>
        <Kicker>$ whoami</Kicker>
        <h1 className={styles.name}>
          {IDENTITY.nameLines[0]}
          <br />
          {IDENTITY.nameLines[1]}
        </h1>
        <div className={styles.roleRow}>
          <div className={styles.role}>{IDENTITY.role}</div>
          <div className={styles.alias}>{IDENTITY.alias}</div>
        </div>
        <p className={styles.pitch}>{IDENTITY.pitch}</p>
        <div className={styles.actions}>
          <PixelButton href={`#${SECTION_IDS.projects}`} variant="filled">
            SEE&nbsp;PROJECTS
          </PixelButton>
          <PixelButton href={`#${SECTION_IDS.contact}`} hover="magenta">
            CONTACT
          </PixelButton>
        </div>
      </Container>
    </section>
  );
}
