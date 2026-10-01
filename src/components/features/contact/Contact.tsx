import { Container } from "@/components/ui/Container";
import { ArrowUpRightIcon } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import { SECTION_IDS } from "@/modules/portfolio/constants";
import { CONTACT_COPY, DISCORD, EMAIL, SECTION_COPY, SOCIAL_LINKS } from "@/modules/portfolio/content";
import styles from "./Contact.module.css";

/** Lets a long address wrap before its `@` rather than mid-domain. `<wbr>`,
 *  unlike a zero-width space, is not copied along with the address. */
function breakableHandle(handle: string): React.ReactNode {
  const at = handle.indexOf("@");
  if (at <= 0) return handle;

  return (
    <>
      {handle.slice(0, at)}
      <wbr />
      {handle.slice(at)}
    </>
  );
}

/** Five signal bars; `live` ones are green, like a server that answered. */
function Ping({ live }: { live: boolean }) {
  return (
    <span className={`${styles.ping} ${live ? styles.live : ""}`} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((bar) => (
        <span key={bar} style={{ height: `${bar * 20}%` }} />
      ))}
    </span>
  );
}

/**
 * The multiplayer screen: the email is "direct connect", every profile is a
 * server in the list — name, handle as its MOTD, ping bars. Discord has no URL,
 * so it is a row without a link and without a ping.
 */
export function Contact() {
  return (
    <Section id={SECTION_IDS.contact} copy={SECTION_COPY.contact}>
      <Container>
        <div className={styles.layout}>
          <div className={styles.direct}>
            <p className={styles.caption}>{CONTACT_COPY.directConnect}</p>
            <a className={styles.email} href={EMAIL.href}>
              <span data-lines>{breakableHandle(EMAIL.handle)}</span>
            </a>
          </div>
          <div className={styles.list}>
            <p className={styles.caption}>{CONTACT_COPY.serverList}</p>
            <ul className={styles.servers}>
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label} data-reveal>
                  <a
                    className={styles.server}
                    href={link.href}
                    // A08/A02: `noopener` denies the opened page access to `window.opener`.
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <span className={styles.icon} aria-hidden="true">
                      {link.label[0]}
                    </span>
                    <span className={styles.text}>
                      <span className={styles.label}>{link.label}</span>
                      <span className={styles.handle}>{link.handle}</span>
                    </span>
                    <Ping live />
                    <ArrowUpRightIcon />
                  </a>
                </li>
              ))}
              <li data-reveal>
                <div className={styles.server}>
                  <span className={styles.icon} aria-hidden="true">
                    {DISCORD.label[0]}
                  </span>
                  <span className={styles.text}>
                    <span className={styles.label}>{DISCORD.label}</span>
                    <span className={styles.handle}>{DISCORD.handle}</span>
                  </span>
                  <Ping live={false} />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
