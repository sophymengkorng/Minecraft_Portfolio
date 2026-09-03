import styles from "./BlinkCursor.module.css";

interface BlinkCursorProps {
  /** `prompt` is the 8×15 shell block; `headline` is the 14×23 contact block. */
  variant?: "prompt" | "headline";
  color?: "cyan" | "magenta";
}

export function BlinkCursor({
  variant = "prompt",
  color = "cyan",
}: BlinkCursorProps) {
  return (
    <span
      aria-hidden="true"
      className={`${styles.cursor} ${styles[variant]} ${color === "magenta" ? styles.magenta : ""}`}
    />
  );
}
