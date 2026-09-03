import styles from "./PixelButton.module.css";

interface PixelButtonProps {
  href: string;
  children: React.ReactNode;
  /** `filled` is the cyan CTA; `outline` is a bordered link. */
  variant?: "filled" | "outline";
  /** Accent an outline button picks up on hover. Ignored when filled. */
  hover?: "cyan" | "magenta";
  size?: "hero" | "contact";
  external?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export function PixelButton({
  href,
  children,
  variant = "outline",
  hover = "cyan",
  size = "hero",
  external = false,
  onClick,
}: PixelButtonProps) {
  const accent =
    variant === "filled"
      ? ""
      : hover === "magenta"
        ? styles.hoverMagenta
        : styles.hoverCyan;

  return (
    <a
      href={href}
      onClick={onClick}
      className={`${styles.button} ${styles[size]} ${variant === "filled" ? styles.filled : ""} ${accent}`}
      // A08/A02: `noopener` denies the opened page access to `window.opener`.
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
