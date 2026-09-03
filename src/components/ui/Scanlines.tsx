import styles from "./Scanlines.module.css";

/** CRT scanline overlay. Stretches the full height of its positioned parent. */
export function Scanlines() {
  return <div className={styles.scanlines} aria-hidden="true" />;
}
