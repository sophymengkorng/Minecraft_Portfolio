import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Pixelify_Sans } from "next/font/google";
import { siteConfig } from "@/config/site";
import { THEME_BOOT_SCRIPT } from "@/modules/theme/theme";
import "@/styles/globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

/** Headings, labels and buttons — the Minecraft half of the type. */
const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixelify",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  icons: {
    icon: "/ninja-logo.png",
    shortcut: "/ninja-logo.png",
    apple: "/ninja-logo.png",
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: "@sophymengkorng",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3efe3" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1115" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // `data-theme` is written by the boot script before React hydrates, so the
    // attribute legitimately differs from the server's HTML.
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${pixelify.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Runs before the body paints: sets day or night with no flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      {/*
        Browser extensions (password managers, Grammarly, dark-mode tools) stamp
        attributes onto <body> before React hydrates, which reads as a mismatch.
        This suppresses the warning for this element's own attributes and text
        only — one level deep — so real mismatches inside the tree still surface.
      */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
