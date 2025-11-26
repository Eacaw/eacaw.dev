"use client"

import { ExternalLink, Github, Star } from "lucide-react"
import type { Project } from "@/components/sections/projects"

interface ProjectCardProps {
  project: Project
  onClick: () => void
  featured?: boolean
}

export function ProjectCard({ project, onClick, featured }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
        featured
          ? "bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-purple-500/20 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10"
          : "bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50"
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 backdrop-blur-sm">
          <Star className="h-3 w-3 text-purple-400 fill-purple-400" />
          <span className="text-xs text-purple-300">Featured</span>
        </div>
      )}

      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            project.thumbnailUrl ||
            `https://placehold.co/600x400/1e293b/a855f7?text=${encodeURIComponent(project.title)}`
          }
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
          {project.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-xs rounded-md bg-slate-700/50 text-slate-400">
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-sm text-slate-400 hover:text-purple-400 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>Code</span>
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Demo</span>
            </a>
          )}
        </div>
      </div>

      {/* Hover Gradient Border */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-xl" />
      </div>
    </div>
  )
}
