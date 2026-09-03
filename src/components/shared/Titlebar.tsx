import { Container } from "@/components/ui/Container";
import { SECTION_ORDER } from "@/modules/portfolio/constants";
import { sectionHref } from "@/modules/portfolio/navigation";
import { siteConfig } from "@/config/site";
import styles from "./Titlebar.module.css";

export function Titlebar() {
  return (
    <header className={styles.titlebar}>
      <Container row>
        <div className={styles.lights} aria-hidden="true">
          <div className={styles.light} />
          <div className={styles.light} />
          <div className={styles.light} />
        </div>
        <div className={styles.path}>{siteConfig.shellPath}</div>
        <nav className={styles.nav} aria-label="Sections">
          {SECTION_ORDER.map((section) => (
            <a key={section} href={sectionHref(section)}>
              {section}
            </a>
          ))}
        </nav>
      </Container>
    </header>
  );
}
