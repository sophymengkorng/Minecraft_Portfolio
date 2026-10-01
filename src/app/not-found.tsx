import Link from "next/link";
import styles from "./status.module.css";

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <div className={styles.panel}>
        <h1 className={styles.code}>404</h1>
        <p className={styles.line}>This chunk hasn&apos;t generated yet.</p>
        <p className={styles.line}>zsh: no such file or directory</p>
        <div className={styles.actions}>
          <Link className={styles.button} href="/">
            Respawn at spawn
          </Link>
        </div>
      </div>
    </div>
  );
}
