"use client"

import { useEffect } from "react"
import { X, ExternalLink, Github } from "lucide-react"
import ReactMarkdown from "react-markdown"
import type { Project } from "@/components/sections/projects"

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [project])

  if (!project) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-slate-900 border border-slate-700/50 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors backdrop-blur-sm"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Image Header */}
        <div className="relative h-64">
          <img
            src={
              project.thumbnailUrl ||
              `https://placehold.co/800x400/1e293b/a855f7?text=${encodeURIComponent(project.title)}`
            }
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-3xl font-bold text-white mb-2">{project.title}</h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
          {/* Links */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700/50">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <Github className="h-5 w-5" />
                <span>View Source</span>
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-500 hover:to-cyan-500 transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
                <span>Live Demo</span>
              </a>
            )}
          </div>

          {/* Markdown Content */}
          <div className="prose prose-invert prose-purple max-w-none prose-headings:text-white prose-p:text-slate-300 prose-a:text-purple-400 prose-code:text-cyan-400 prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700">
            <ReactMarkdown>{project.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}
