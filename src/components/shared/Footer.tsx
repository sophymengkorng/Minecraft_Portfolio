import { Container } from "@/components/ui/Container";
import { ArrowUpIcon } from "@/components/ui/Icons";
import { FOOTER, IDENTITY } from "@/modules/portfolio/content";
import styles from "./Footer.module.css";

/** The page ends on the ground: a grass-and-dirt strip under the last section. */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.ground} aria-hidden="true" />
      <Container className={styles.row}>
        <span>
          © {new Date().getFullYear()} {IDENTITY.name}
        </span>
        <span>{FOOTER.builtWith}</span>
        {/* A plain anchor on purpose: SectionRouter upgrades it to a smooth scroll to the top (see there for why not next/link). */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className={styles.top} href="/">
          Back to spawn <ArrowUpIcon />
        </a>
      </Container>
      <Container>
        <p className={styles.disclaimer}>{FOOTER.disclaimer}</p>
      </Container>
    </footer>
  );
}
