"use client";

import styles from "./status.module.css";

/**
 * A10: the visitor sees a fixed message and, at most, Next's error digest — the
 * stack trace and message stay server-side.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.panel}>
        <h1 className={styles.code}>500</h1>
        <p className={styles.line}>zsh: segmentation fault</p>
        <p className={styles.line}>something broke on this screen.</p>
        {error.digest ? (
          <p className={styles.digest}>ref: {error.digest}</p>
        ) : null}
        <div className={styles.actions}>
          <button className={styles.button} type="button" onClick={reset}>
            RETRY
          </button>
        </div>
      </div>
    </div>
  );
}
