import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { PixelButton } from "@/components/ui/PixelButton";
import { TypedLines } from "@/components/ui/TypedLines";
import { IDENTITY } from "@/modules/portfolio/content";
import { sectionHref } from "@/modules/portfolio/navigation";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <Container>
        <Kicker>$ whoami</Kicker>
        <h1 className={styles.name}>
          <TypedLines lines={IDENTITY.nameLines} />
        </h1>
        <div className={styles.roleRow}>
          <div className={styles.role}>{IDENTITY.role}</div>
          <div className={styles.alias}>{IDENTITY.alias}</div>
        </div>
        <p className={styles.pitch}>{IDENTITY.pitch}</p>
        <div className={styles.actions}>
          <PixelButton href={sectionHref("projects")} variant="filled">
            SEE&nbsp;PROJECTS
          </PixelButton>
          <PixelButton href={sectionHref("contact")} hover="magenta">
            CONTACT
          </PixelButton>
        </div>
      </Container>
    </section>
  );
}
