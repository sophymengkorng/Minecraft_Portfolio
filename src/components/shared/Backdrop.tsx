import styles from "./Backdrop.module.css";

/** A faint block grid behind the whole page. */
export function Backdrop() {
  return <div className={styles.grid} aria-hidden="true" />;
}
