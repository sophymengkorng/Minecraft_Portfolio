"use client";

import styles from "./status.module.css";
import "@/styles/globals.css";

/** Replaces the root layout, so it must render its own <html>/<body>. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className={styles.wrap}>
          <div className={styles.panel}>
            <h1 className={styles.code}>PANIC</h1>
            <p className={styles.line}>kernel panic — not syncing.</p>
            {error.digest ? (
              <p className={styles.digest}>ref: {error.digest}</p>
            ) : null}
            <div className={styles.actions}>
              <button className={styles.button} type="button" onClick={reset}>
                REBOOT
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
