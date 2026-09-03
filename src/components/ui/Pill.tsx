import styles from "./Pill.module.css";

type PillSize = "default" | "small" | "large";

/** `small` is the dense project-card variant; `large` fills the skills panels. */
export function Pill({ children, size = "default" }: { children: React.ReactNode; size?: PillSize }) {
  const variant = size === "small" ? styles.small : size === "large" ? styles.large : "";
  return <span className={`${styles.pill} ${variant}`}>{children}</span>;
}
