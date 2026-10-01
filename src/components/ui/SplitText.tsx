import styles from "./SplitText.module.css";

type CharStyle = React.CSSProperties & Record<`--${string}`, number>;

interface SplitCharsProps {
  lines: readonly string[];
  /** Paints the last line in the accent colour. */
  accentLast?: boolean;
  /** `inline` runs the lines on as words that wrap; `stack` breaks after each. */
  layout?: "stack" | "inline";
}

/**
 * Splits text into one masked span per character, on the server, so letters
 * can animate (the hero's CSS rise, the headings' GSAP fill) without a
 * client-side splitter mutating the DOM under React. Each character carries
 * `--i`, its index across all lines, for staggering.
 *
 * Screen readers get the plain text once; the per-letter spans are hidden,
 * since some readers announce split letters one at a time.
 */
export function SplitChars({ lines, accentLast = false, layout = "stack" }: SplitCharsProps) {
  return (
    <>
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden="true" className={`${styles.lines} ${styles[layout]}`}>
        {lines.map((line, lineIndex) => {
          const chars = Array.from(line);
          // Characters on earlier lines, so --i keeps counting across breaks.
          const offset = lines.slice(0, lineIndex).join("").length;
          const accent = accentLast && lineIndex === lines.length - 1;

          return (
            <span key={lineIndex} className={`${styles.line} ${accent ? styles.accent : ""}`}>
              {chars.map((char, charIndex) => (
                <span
                  key={charIndex}
                  className={styles.char}
                  data-char
                  style={{ "--i": offset + charIndex } as CharStyle}
                >
                  {char === " " ? " " : char}
                </span>
              ))}
            </span>
          );
        })}
      </span>
    </>
  );
}
