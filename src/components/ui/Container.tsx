import styles from "./Container.module.css";

interface ContainerProps {
  children: React.ReactNode;
  /** Lays the content out as a centered flex row — used by the chrome bars. */
  row?: boolean;
  className?: string;
}

/**
 * Every band on the page — sections and chrome alike — puts its content on this
 * one 80% measure, so the titlebar, the copy and the command bar all sit on the
 * same left and right rails while their backgrounds run full-bleed.
 */
export function Container({
  children,
  row = false,
  className = "",
}: ContainerProps) {
  return (
    <div
      className={`${styles.container} ${row ? styles.row : ""} ${className}`}
    >
      {children}
    </div>
  );
}
