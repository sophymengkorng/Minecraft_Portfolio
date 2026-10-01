import type { SectionCopy } from "@/modules/portfolio/types";
import { Container } from "./Container";
import { SectionHeader } from "./SectionHeader";
import styles from "./Section.module.css";

interface SectionProps {
  id: string;
  copy: SectionCopy;
  children: React.ReactNode;
}

/**
 * A content band with its header on the container measure. The body is left
 * unwrapped so a section can run something full-bleed (the skills marquee, the
 * projects rail) and wrap the rest in `Container` itself.
 */
export function Section({ id, copy, children }: SectionProps) {
  return (
    <section id={id} className={styles.section}>
      <Container>
        <SectionHeader copy={copy} />
      </Container>
      {children}
    </section>
  );
}
