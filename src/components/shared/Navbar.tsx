import { SECTION_ORDER } from "@/modules/portfolio/constants";
import { SECTION_COPY } from "@/modules/portfolio/content";
import { sectionHref } from "@/modules/portfolio/navigation";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Navbar.module.css";

/**
 * Fixed top bar. `aria-current` on the links, the XP bar's fill and its level
 * number are driven by `MotionDirector` through the `data-nav-link`,
 * `data-scroll-progress` and `data-xp-level` hooks, so this stays a server
 * component; only the theme toggle is a client island.
 */
export function Navbar() {
  return (
    <header className={styles.header}>
      <nav className={styles.bar} aria-label="Sections">
        {/* A plain anchor on purpose: SectionRouter upgrades it to a smooth scroll to the top (see there for why not next/link). */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className={styles.brand}>
          <span className={styles.block} aria-hidden="true" />
          cachewraith
          <span className="sr-only">, back to top</span>
        </a>
        <ul className={styles.links}>
          {SECTION_ORDER.map((section) => (
            <li key={section}>
              <a className={styles.link} href={sectionHref(section)} data-nav-link={section}>
                <span className={styles.num} aria-hidden="true">
                  {SECTION_COPY[section].index}
                </span>
                {section}
              </a>
            </li>
          ))}
        </ul>
        <ThemeToggle />
      </nav>
      <div className={styles.xp} aria-hidden="true">
        <span className={styles.fill} data-scroll-progress />
        <span className={styles.level} data-xp-level>
          0
        </span>
      </div>
    </header>
  );
}
