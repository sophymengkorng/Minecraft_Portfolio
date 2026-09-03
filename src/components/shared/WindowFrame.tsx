import { Scanlines } from "@/components/ui/Scanlines";
import styles from "./WindowFrame.module.css";

/**
 * The CRT window chrome. In the prototype this was a fixed-height box with its
 * own scroll container; here the page itself scrolls, so the frame simply grows
 * with the content and the scanline overlay stretches over all of it.
 */
export function WindowFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <div className={styles.frame}>
        <Scanlines />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
