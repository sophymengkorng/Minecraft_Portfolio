import { Container } from "@/components/ui/Container";
import { ArrowUpRightIcon } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import { SECTION_IDS } from "@/modules/portfolio/constants";
import { PROJECT_TOAST, PROJECTS, SECTION_COPY } from "@/modules/portfolio/content";
import styles from "./Projects.module.css";

/**
 * Each project is an advancement toast: a framed icon, the yellow "made!"
 * line, the name, what it is and what it is built with. The card is a single
 * link, so it is one click target and one tab stop, named by the project.
 * Names decode as they enter and again on hover (`data-scramble` inside
 * `data-scramble-row`).
 */
export function Projects() {
  return (
    <Section id={SECTION_IDS.projects} copy={SECTION_COPY.projects}>
      <Container>
        <ol className={styles.grid}>
          {PROJECTS.map((project) => (
            <li key={project.name} className={styles.item} data-reveal>
              <a
                className={styles.card}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                data-scramble-row
              >
                <span className={styles.frame} aria-hidden="true">
                  {project.index}
                </span>
                <span className={styles.body}>
                  <span className={styles.toast} aria-hidden="true">
                    {PROJECT_TOAST}
                  </span>
                  <span className={styles.name} data-scramble>
                    {project.name}
                  </span>
                  <span className={styles.description}>{project.description}</span>
                  <span className={styles.stack}>
                    {project.stack.map((tech) => (
                      <span key={tech} className={styles.tag}>
                        {tech}
                      </span>
                    ))}
                  </span>
                </span>
                <span className={styles.arrow} aria-hidden="true">
                  <ArrowUpRightIcon />
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
