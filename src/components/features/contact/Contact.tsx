import { Container } from "@/components/ui/Container";
import { BlinkCursor } from "@/components/ui/BlinkCursor";
import { Kicker } from "@/components/ui/Kicker";
import { PixelButton } from "@/components/ui/PixelButton";
import { SECTION_IDS } from "@/modules/portfolio/constants";
import { CONTACT_LINKS, DISCORD_CHIP } from "@/modules/portfolio/content";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <section id={SECTION_IDS.contact} className={styles.contact}>
      <Container>
        <Kicker gap="wide">$ ./contact.sh</Kicker>
        <h2 className={styles.headline}>
          LET&apos;S&nbsp;BUILD
          <br />
          SOMETHING
          <BlinkCursor variant="headline" color="magenta" />
        </h2>
        <div className={styles.links}>
          {CONTACT_LINKS.map((link) => (
            <PixelButton
              key={link.label}
              href={link.href}
              size="contact"
              external={link.external}
            >
              {link.label}
            </PixelButton>
          ))}
          <span className={styles.chip}>{DISCORD_CHIP}</span>
        </div>
      </Container>
    </section>
  );
}
