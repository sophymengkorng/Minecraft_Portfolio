import styles from "./Kicker.module.css";

/** The `$ cat about.md` shell-prompt line that heads each section. */
export function Kicker({
  children,
  gap = "default",
}: {
  children: React.ReactNode;
  gap?: "default" | "wide";
}) {
  return (
    <div className={`${styles.kicker} ${gap === "wide" ? styles.wide : ""}`}>
      {children}
    </div>
  );
}
