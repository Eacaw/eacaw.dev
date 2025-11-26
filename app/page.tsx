import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/hero"
import { AboutSection } from "@/components/sections/about"
import { ProjectsSection } from "@/components/sections/projects"
import { GitHubActivitySection } from "@/components/sections/github-activity"
import { ContactSection } from "@/components/sections/contact"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <GitHubActivitySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
