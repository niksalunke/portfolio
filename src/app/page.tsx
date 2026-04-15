import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Timeline from "@/components/Timeline";
import Dock from "@/components/Dock";
import Contact from "@/components/Contact";
import Certifications from "@/components/Certifications";
import Blog from "@/components/Blog";

export default function Home() {
  return (
    <main className="bg-[#121212] min-h-screen text-white">
      <Hero />
      <Projects />
      <Certifications />
      <Blog />
      <Skills />
      <Timeline />
      <Dock />
      <Contact />
    </main>
  );
}
