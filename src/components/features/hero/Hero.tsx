import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowDownIcon, ArrowUpRightIcon } from "@/components/ui/Icons";
import { SplitChars } from "@/components/ui/SplitText";
import { TypedLines } from "@/components/ui/TypedLines";
import { IDENTITY, SKILL_GROUPS, SPLASHES } from "@/modules/portfolio/content";
import { sectionHref } from "@/modules/portfolio/navigation";
import { HeroScene } from "./HeroScene";
import { Splash } from "./Splash";
import styles from "./Hero.module.css";

const ROLE_LINES = [IDENTITY.role] as const;
const HEADLINE_STACK = SKILL_GROUPS[0]?.items.slice(0, 3) ?? [];

/**
 * Copy on the left, the voxel island on the right (below it on narrow
 * screens). The intro plays in CSS keyframes rather than GSAP: it runs on
 * first paint, with no hidden-until-hydrated state, and still works with JS
 * off. `data-hero-content` is the hook `MotionDirector` uses to drift the copy
 * upward as the hero scrolls away.
 */
export function Hero() {
  return (
    <section className={styles.hero}>
      <HeroScene />
      <Container>
        <div className={styles.content} data-hero-content>
          <p className={styles.joined}>
            <span data-scramble>{IDENTITY.joined}</span>
          </p>
          <div className={styles.title}>
            <h1 className={styles.name}>
              <SplitChars lines={IDENTITY.nameLines} />
            </h1>
            <Splash lines={SPLASHES} />
          </div>
          <div className={styles.role}>
            <span className={styles.prompt} aria-hidden="true">
              &gt;
            </span>
            <TypedLines lines={ROLE_LINES} />
          </div>
          <ul className={styles.stack} aria-label="Main stack">
            {HEADLINE_STACK.map((item) => (
              <li key={item} className={styles.chip}>
                {item}
              </li>
            ))}
            <li className={styles.alias}>{IDENTITY.alias}</li>
          </ul>
          <div className={styles.actions}>
            <Button href={sectionHref("projects")} variant="solid">
              View projects <ArrowUpRightIcon />
            </Button>
            <Button href={sectionHref("contact")}>Get in touch</Button>
          </div>
        </div>
      </Container>
      <p className={styles.cue} aria-hidden="true">
        scroll <ArrowDownIcon />
      </p>
    </section>
  );
}
