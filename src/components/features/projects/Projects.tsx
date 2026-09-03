import { Kicker } from "@/components/ui/Kicker";
import { Section } from "@/components/ui/Section";
import { SECTION_IDS } from "@/modules/portfolio/constants";
import { PROJECTS } from "@/modules/portfolio/content";
import { ProjectCard } from "./ProjectCard";
import styles from "./Projects.module.css";

export function Projects() {
  return (
    <Section id={SECTION_IDS.projects}>
      <Kicker gap="wide">$ git log --oneline ./projects</Kicker>
      <div className={styles.list}>
        {PROJECTS.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </Section>
  );
}
