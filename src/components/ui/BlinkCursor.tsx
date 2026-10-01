import styles from "./BlinkCursor.module.css";

/** An underscore caret, like the game chat's, sized in em to track its type. */
export function BlinkCursor() {
  return <span aria-hidden="true" className={styles.cursor} />;
}
