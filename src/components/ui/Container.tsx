import styles from "./Container.module.css";

/**
 * Every band on the page puts its content on the one `--container` measure, so
 * the nav, the sections and the footer share left and right rails while their
 * backgrounds run full-bleed.
 */
export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`${styles.container} ${className}`}>{children}</div>;
}
