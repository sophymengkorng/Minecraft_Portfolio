import styles from "./Button.module.css";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  /** `solid` is the grass-green call to action; `outline` is the stone one. */
  variant?: "solid" | "outline";
  external?: boolean;
}

/**
 * A link styled as a Minecraft GUI button: bevelled, hard-edged, and it sinks
 * when pressed. It leans toward the pointer (`data-magnetic`).
 */
export function Button({ href, children, variant = "outline", external = false }: ButtonProps) {
  return (
    <a
      href={href}
      className={`${styles.button} ${styles[variant]}`}
      data-magnetic
      // A08/A02: `noopener` denies the opened page access to `window.opener`.
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className={styles.label}>{children}</span>
    </a>
  );
}
