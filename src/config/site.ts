export const siteConfig = {
  name: "Somonor Hong — CacheWraith",
  title: "Somonor Hong — Software Engineer",
  description:
    "Junior Backend Developer building backend systems with Laravel, NestJS, and Spring Boot, and shipping full-stack side projects with Next.js, React, RabbitMQ, and Postgres.",
  /** Falls back to a relative base when the env var is absent (e.g. preview builds). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  shellPath: "~/somonor-hong",
} as const;
