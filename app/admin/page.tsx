"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  LogOut,
  FolderKanban,
  Mail,
  Star,
  StarOff,
  ExternalLink,
  Github,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

interface Project {
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

interface Message {
  id: string
  email: string
  message: string
  timestamp: Date
  read: boolean
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"projects" | "messages">("projects")
  const [projects, setProjects] = useState<Project[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    repoUrl: "",
    demoUrl: "",
    thumbnailUrl: "",
    featured: false,
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch projects
      const projectsQuery = query(collection(db, "projects"), orderBy("createdAt", "desc"))
      const projectsSnapshot = await getDocs(projectsQuery)
      const projectsData = projectsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Project[]
      setProjects(projectsData)

      // Fetch messages
      const messagesQuery = query(collection(db, "messages"), orderBy("timestamp", "desc"))
      const messagesSnapshot = await getDocs(messagesQuery)
      const messagesData = messagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as Message[]
      setMessages(messagesData)
    } catch (error) {
      console.log("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut(auth)
    router.push("/")
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      tags: "",
      repoUrl: "",
      demoUrl: "",
      thumbnailUrl: "",
      featured: false,
    })
    setEditingProject(null)
    setIsCreating(false)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      content: project.content,
      tags: project.tags.join(", "),
      repoUrl: project.repoUrl || "",
      demoUrl: project.demoUrl || "",
      thumbnailUrl: project.thumbnailUrl || "",
      featured: project.featured || false,
    })
    setIsCreating(false)
  }

  const handleSaveProject = async () => {
    if (!user) return

    const projectData = {
      title: formData.title,
      content: formData.content,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      repoUrl: formData.repoUrl || null,
      demoUrl: formData.demoUrl || null,
      thumbnailUrl: formData.thumbnailUrl || null,
      featured: formData.featured,
    }

    try {
      if (editingProject) {
        // Update existing
        await updateDoc(doc(db, "projects", editingProject.id), projectData)
      } else {
        // Create new
        await addDoc(collection(db, "projects"), {
          ...projectData,
          createdAt: serverTimestamp(),
        })
      }

      resetForm()
      fetchData()
    } catch (error) {
      console.log("Error saving project:", error)
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!user) return
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      await deleteDoc(doc(db, "projects", id))
      fetchData()
    } catch (error) {
      console.log("Error deleting project:", error)
    }
  }

  const handleToggleFeatured = async (project: Project) => {
    if (!user) return

    try {
      await updateDoc(doc(db, "projects", project.id), {
        featured: !project.featured,
      })
      fetchData()
    } catch (error) {
      console.log("Error toggling featured:", error)
    }
  }

  const handleMarkMessageRead = async (id: string) => {
    if (!user) return

    try {
      await updateDoc(doc(db, "messages", id), { read: true })
      fetchData()
    } catch (error) {
      console.log("Error marking message read:", error)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Link>
              <div className="h-6 w-px bg-slate-700" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "projects"
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <FolderKanban className="h-4 w-4" />
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "messages"
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Mail className="h-4 w-4" />
            Messages ({messages.filter((m) => !m.read).length} new)
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
          </div>
        ) : activeTab === "projects" ? (
          <div className="space-y-6">
            {/* Create/Edit Form */}
            {(isCreating || editingProject) && (
              <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">
                    {editingProject ? "Edit Project" : "New Project"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-purple-500/50"
                      placeholder="Project Title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-purple-500/50"
                      placeholder="React, TypeScript, Firebase"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Repository URL</label>
                    <input
                      type="url"
                      value={formData.repoUrl}
                      onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-purple-500/50"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Demo URL</label>
                    <input
                      type="url"
                      value={formData.demoUrl}
                      onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-purple-500/50"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Thumbnail URL</label>
                    <input
                      type="url"
                      value={formData.thumbnailUrl}
                      onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-purple-500/50"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 rounded bg-slate-800 border-slate-700"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-slate-300">
                      Featured Project
                    </label>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Content (Markdown)</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={8}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50 resize-none"
                      placeholder="# Project Title&#10;&#10;Description of your project...&#10;&#10;## Features&#10;- Feature 1&#10;- Feature 2"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <button
                    onClick={handleSaveProject}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium hover:from-purple-500 hover:to-cyan-500 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    Save Project
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Add Button */}
            {!isCreating && !editingProject && (
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium hover:from-purple-500 hover:to-cyan-500 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Project
              </button>
            )}

            {/* Projects List */}
            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="text-center py-12 text-slate-400">No projects yet. Create your first project!</div>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={
                          project.thumbnailUrl ||
                          `https://placehold.co/80x80/1e293b/a855f7?text=${encodeURIComponent(project.title.charAt(0))}`
                        }
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white truncate">{project.title}</h3>
                        {project.featured && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                            <Star className="h-3 w-3 fill-current" />
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {project.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 text-xs rounded bg-slate-700/50 text-slate-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        {project.repoUrl && (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-slate-400 hover:text-purple-400"
                          >
                            <Github className="h-3 w-3" />
                            Repo
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-slate-400 hover:text-cyan-400"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Demo
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        className={`p-2 rounded-lg transition-colors ${
                          project.featured
                            ? "text-purple-400 hover:bg-purple-500/20"
                            : "text-slate-400 hover:text-white hover:bg-slate-700"
                        }`}
                        title={project.featured ? "Remove from featured" : "Add to featured"}
                      >
                        {project.featured ? <Star className="h-5 w-5 fill-current" /> : <StarOff className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => handleEditProject(project)}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-slate-400">No messages yet.</div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-6 rounded-xl border transition-colors ${
                    message.read ? "bg-slate-800/30 border-slate-700/30" : "bg-slate-800/50 border-purple-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <a
                        href={`mailto:${message.email}`}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        {message.email}
                      </a>
                      <p className="text-sm text-slate-500 mt-1">
                        {message.timestamp.toLocaleDateString()} at {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {!message.read && (
                      <button
                        onClick={() => handleMarkMessageRead(message.id)}
                        className="text-xs px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                  <p className="text-slate-300 whitespace-pre-wrap">{message.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
