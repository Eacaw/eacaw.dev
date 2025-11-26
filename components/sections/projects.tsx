"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ProjectCard } from "@/components/project-card"
import { ProjectModal } from "@/components/project-modal"
import { Loader2 } from "lucide-react"

export interface Project {
  id: string
  title: string
  content: string
  tags: string[]
  repoUrl?: string
  demoUrl?: string
  thumbnailUrl?: string
  featured?: boolean
  createdAt: Date
}

// Demo projects for when Firebase isn't configured
const demoProjects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    content: `# E-Commerce Platform\n\nA full-featured e-commerce solution built with Next.js and Stripe.\n\n## Features\n- Product catalog with search\n- Shopping cart functionality\n- Secure checkout with Stripe\n- Order tracking\n\n\`\`\`typescript\nconst checkout = async (items: CartItem[]) => {\n  const session = await stripe.checkout.sessions.create({\n    line_items: items,\n    mode: 'payment'\n  });\n  return session;\n};\n\`\`\``,
    tags: ["Next.js", "Stripe", "TypeScript", "Tailwind"],
    repoUrl: "https://github.com",
    demoUrl: "https://example.com",
    thumbnailUrl: "https://placehold.co/600x400/1e293b/a855f7?text=E-Commerce",
    featured: true,
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "AI Chat Application",
    content: `# AI Chat Application\n\nReal-time chat powered by OpenAI's GPT-4.\n\n## Highlights\n- Real-time messaging\n- AI-powered responses\n- Conversation history\n- Dark mode support`,
    tags: ["React", "OpenAI", "WebSocket", "Node.js"],
    repoUrl: "https://github.com",
    demoUrl: "https://example.com",
    thumbnailUrl: "https://placehold.co/600x400/1e293b/06b6d4?text=AI+Chat",
    featured: true,
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Task Management",
    content: `# Task Management App\n\nA Kanban-style task manager with drag and drop.\n\n## Features\n- Drag and drop boards\n- Team collaboration\n- Due date reminders\n- Progress tracking`,
    tags: ["React", "DnD Kit", "Firebase", "Tailwind"],
    repoUrl: "https://github.com",
    thumbnailUrl: "https://placehold.co/600x400/1e293b/a855f7?text=Tasks",
    featured: false,
    createdAt: new Date(),
  },
  {
    id: "4",
    title: "Analytics Dashboard",
    content: `# Analytics Dashboard\n\nReal-time analytics with beautiful charts.\n\n## Features\n- Live data visualization\n- Custom reports\n- Export functionality\n- Team insights`,
    tags: ["Next.js", "Chart.js", "PostgreSQL"],
    demoUrl: "https://example.com",
    thumbnailUrl: "https://placehold.co/600x400/1e293b/06b6d4?text=Analytics",
    featured: false,
    createdAt: new Date(),
  },
  {
    id: "5",
    title: "Social Media App",
    content: `# Social Platform\n\nA modern social networking application.\n\n## Features\n- User profiles\n- Real-time feed\n- Stories feature\n- Direct messaging`,
    tags: ["React Native", "Firebase", "Redux"],
    repoUrl: "https://github.com",
    thumbnailUrl: "https://placehold.co/600x400/1e293b/a855f7?text=Social",
    featured: true,
    createdAt: new Date(),
  },
  {
    id: "6",
    title: "Developer Portfolio",
    content: `# Developer Portfolio\n\nThis very portfolio you're looking at!\n\n## Built With\n- Next.js 14\n- Firebase\n- Tailwind CSS\n- Framer Motion`,
    tags: ["Next.js", "Firebase", "Tailwind"],
    repoUrl: "https://github.com",
    demoUrl: "https://example.com",
    thumbnailUrl: "https://placehold.co/600x400/1e293b/06b6d4?text=Portfolio",
    featured: false,
    createdAt: new Date(),
  },
]

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"))
        const snapshot = await getDocs(q)

        if (snapshot.empty) {
          // Use demo projects if no Firebase data
          setProjects(demoProjects)
        } else {
          const projectsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          })) as Project[]
          setProjects(projectsData)
        }
      } catch (error) {
        // Use demo projects if Firebase fails
        console.log("Using demo projects")
        setProjects(demoProjects)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const featuredProjects = projects.filter((p) => p.featured)
  const otherProjects = projects.filter((p) => !p.featured)

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full" />
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            A collection of projects that showcase my skills and passion for building great software.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Featured Projects */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} featured />
              ))}
            </div>

            {/* Other Projects */}
            {otherProjects.length > 0 && (
              <>
                <h3 className="text-xl font-semibold text-slate-300 mb-6">Other Projects</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Project Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  )
}
