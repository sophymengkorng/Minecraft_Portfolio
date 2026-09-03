import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Silkscreen } from "next/font/google";
import { siteConfig } from "@/config/site";
import "@/styles/globals.css";

const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-silkscreen",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
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
    creator: "@cachewraith",
  },
};

export const viewport: Viewport = {
  themeColor: "#06090d",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${silkscreen.variable} ${jetbrainsMono.variable}`}
    >
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
