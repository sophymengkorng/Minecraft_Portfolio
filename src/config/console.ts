/**
 * The console's public API address. Shared by `next.config.ts` (which image
 * hosts the optimizer may fetch) and the projects fetch, so the two can't
 * disagree. Pure, with no imports, so the config file can load it too.
 */

export const DEFAULT_CONSOLE_API_URL = "https://console.cachewraith.com/api/v1";

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/**
 * A02 / A08: the project list is rendered as links and images, so it must not
 * travel in plain text, where anyone on the path could swap in their own.
 * HTTPS is required; plain HTTP is accepted only for a console on this
 * machine. Anything else is a configuration error and throws, so a bad
 * `CONSOLE_API_URL` fails the build loudly rather than shipping.
 */
export function consoleApiUrl(raw: string | undefined = process.env.CONSOLE_API_URL): URL {
  const value = raw?.trim() || DEFAULT_CONSOLE_API_URL;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`CONSOLE_API_URL is not a valid URL: "${value}"`);
  }

  const local = LOOPBACK_HOSTS.has(url.hostname);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && local)) {
    throw new Error(
      `CONSOLE_API_URL must use https:// (plain http is only allowed for localhost): "${value}"`,
    );
  }

  url.pathname = url.pathname.replace(/\/+$/, "");
  return url;
}
