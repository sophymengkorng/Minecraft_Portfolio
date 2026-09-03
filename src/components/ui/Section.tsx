import { Container } from "./Container";
import styles from "./Section.module.css";

/** A full-bleed content band with a 3px bottom rule; content sits on the 80% measure. */
export function Section({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={styles.section}>
      <Container>{children}</Container>
    </section>
  );
}
