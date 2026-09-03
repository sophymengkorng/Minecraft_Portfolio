import { About } from "@/components/features/about/About";
import { Contact } from "@/components/features/contact/Contact";
import { Hero } from "@/components/features/hero/Hero";
import { Projects } from "@/components/features/projects/Projects";
import { Skills } from "@/components/features/skills/Skills";
import { CommandBar } from "@/components/shared/CommandBar";
import { Titlebar } from "@/components/shared/Titlebar";
import { WindowFrame } from "@/components/shared/WindowFrame";

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
    </WindowFrame>
  );
}
