import { Container } from "./Container";
import styles from "./Section.module.css";

interface SectionProps {
  id: string;
  children: React.ReactNode;
  /** Stretches the content over the full section height instead of centering it. */
  fill?: boolean;
}

/** A full-bleed content band with a 3px bottom rule; content sits on the 80% measure. */
export function Section({ id, children, fill = false }: SectionProps) {
  return (
    <section id={id} className={styles.section}>
      <Container fill={fill}>{children}</Container>
    </section>
  );
}
