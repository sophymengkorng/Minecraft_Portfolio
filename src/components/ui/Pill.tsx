import styles from "./Pill.module.css";

/** `size="small"` is the denser variant used inside project cards. */
export function Pill({
  children,
  size = "default",
}: {
  children: React.ReactNode;
  size?: "default" | "small";
}) {
  return (
    <span className={`${styles.pill} ${size === "small" ? styles.small : ""}`}>
      {children}
    </span>
  );
}
