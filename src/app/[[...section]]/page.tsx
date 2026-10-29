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
