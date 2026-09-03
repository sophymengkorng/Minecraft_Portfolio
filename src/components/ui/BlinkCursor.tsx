import styles from "./BlinkCursor.module.css";

interface BlinkCursorProps {
  /**
   * `prompt` is the 8×15 shell block, `headline` the 14×23 contact block, and
   * `caret` that same block sat flush against text a typewriter is producing.
   */
  variant?: "prompt" | "headline" | "caret";
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
