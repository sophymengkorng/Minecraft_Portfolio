import type { NextConfig } from "next";
import { consoleApiUrl } from "./src/config/console";

const isDev = process.env.NODE_ENV === "development";

/**
 * Project covers are served from the console's `/storage`. They go through
 * `next/image`, so the browser loads them from this origin and `img-src 'self'`
 * holds; only the console's storage path is allowed upstream. Mirrors
 * the projects fetch: both read `consoleApiUrl()`, which also rejects a
 * plain-http address. Covers are https-only outside `next dev`, so a swapped
 * image can't ride in on plain HTTP either; in dev, a local console serves
 * them over http.
 */
const consoleUrl = consoleApiUrl();

/**
 * A02 (Security Misconfiguration): the site ships no headers by default, so the
 * baseline set is declared here.
 *
 * CSP note — this is a fully static site with no user-generated markup; the one
 * `dangerouslySetInnerHTML` is the theme boot script, a compile-time constant
 * with nothing interpolated from a request. The CSP is defence in depth rather
 * than the primary XSS control. `script-src` keeps `'unsafe-inline'` because Next inlines
 * its own bootstrap/flight payload; removing it requires a per-request nonce from
 * middleware, which would opt every page out of static generation. If that trade
 * ever becomes worth it, generate a nonce in `src/middleware.ts` and swap
 * `'unsafe-inline'` for `'nonce-<value>' 'strict-dynamic'`.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  // The console: project link clicks are beaconed straight to its API.
  `connect-src 'self' ${consoleUrl.origin}${isDev ? " ws:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: (isDev ? (["http", "https"] as const) : (["https"] as const)).map((protocol) => ({
      protocol,
      hostname: consoleUrl.hostname,
      port: consoleUrl.port,
      pathname: "/storage/**",
    })),
    // A local console (127.0.0.1) is a private IP, which the optimizer refuses
    // by default (SSRF guard). Only lifted for `next dev`.
    dangerouslyAllowLocalIP: isDev,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
