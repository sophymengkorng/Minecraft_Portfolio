import { About } from "@/components/features/about/About";
import { Contact } from "@/components/features/contact/Contact";
import { Hero } from "@/components/features/hero/Hero";
import { Projects } from "@/components/features/projects/Projects";
import { Skills } from "@/components/features/skills/Skills";
import { Backdrop } from "@/components/shared/Backdrop";
import { CommandBar } from "@/components/shared/CommandBar";
import { Footer } from "@/components/shared/Footer";
import { MotionDirector } from "@/components/shared/MotionDirector";
import { Navbar } from "@/components/shared/Navbar";
import { SectionRouter } from "@/components/shared/SectionRouter";
import { SmoothScroll } from "@/components/shared/SmoothScroll";
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
    <SmoothScroll>
      <Backdrop />
      <Navbar />
      <main className="page">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <CommandBar />
      <SectionRouter />
      <MotionDirector />
    </SmoothScroll>
  );
}
