import { About } from "@/components/features/about/About";
import { Contact } from "@/components/features/contact/Contact";
import { Hero } from "@/components/features/hero/Hero";
import { Projects } from "@/components/features/projects/Projects";
import { Skills } from "@/components/features/skills/Skills";
import { CommandBar } from "@/components/shared/CommandBar";
import { SectionRouter } from "@/components/shared/SectionRouter";
import { Titlebar } from "@/components/shared/Titlebar";
import { WindowFrame } from "@/components/shared/WindowFrame";
import { SECTION_ORDER } from "@/modules/portfolio/constants";

/**
 * One page, five routes. `/`, `/about`, `/skills`, `/projects` and `/contact`
 * all serve this same document — the sections are bands on a single scroll, so
 * the route only decides where the page lands. `SectionRouter` does the landing.
 *
 * `dynamicParams: false` means anything outside `generateStaticParams` is a 404
 * (`not-found.tsx`) rather than another copy of the home page at a junk URL.
 */
export const dynamicParams = false;

export function generateStaticParams(): { section: string[] }[] {
  return [{ section: [] }, ...SECTION_ORDER.map((section) => ({ section: [section] }))];
}

export default function HomePage() {
  return (
    <WindowFrame>
      <Titlebar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <CommandBar />
      <SectionRouter />
    </WindowFrame>
  );
}
