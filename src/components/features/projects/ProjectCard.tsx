import { Pill } from "@/components/ui/Pill";
import type { Project } from "@/modules/portfolio/types";
import styles from "./ProjectCard.module.css";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={styles.card}>
      <div className={styles.index} aria-hidden="true">
        {project.index}
      </div>
      <div>
        <h3 className={styles.title}>{project.name}</h3>
        <p className={styles.description}>{project.description}</p>
        <div className={styles.stack}>
          {project.stack.map((tech) => (
            <Pill key={tech} size="small">
              {tech}
            </Pill>
          ))}
        </div>
      </div>
      <a
        className={styles.open}
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${project.name} in a new tab`}
      >
        OPEN&nbsp;↗
      </a>
    </article>
  );
}
