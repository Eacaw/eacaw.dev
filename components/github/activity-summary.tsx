"use client"

import { useState, useEffect } from "react"
import {
  GitCommit,
  GitPullRequest,
  GitMerge,
  CircleDot,
  MessageSquare,
  GitFork,
  Star,
  Loader2,
  FolderPlus,
  Eye,
  ExternalLink,
  GitBranch,
  Tag,
  Trash2,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ActivitySummaryStats {
  pushes: number
  commits: number
  pullRequestsOpened: number
  pullRequestsClosed: number
  pullRequestsMerged: number
  issuesOpened: number
  issuesClosed: number
  reviews: number
  comments: number
  forks: number
  stars: number
  reposCreated: number
}

interface DetailedEvent {
  id: string
  type: string
  repo: string
  repoUrl: string
  timestamp: string
  description: string
  details?: {
    title?: string
    body?: string
    url?: string
    commits?: { sha: string; message: string }[]
    branch?: string
    action?: string
    number?: number
  }
}

interface ActivityData {
  summary: ActivitySummaryStats
  recentRepos: string[]
  totalEvents: number
  detailedEvents: DetailedEvent[]
}

export function ActivitySummary() {
  const [data, setData] = useState<ActivityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDetailedFeed, setShowDetailedFeed] = useState(false)
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch("/api/github/events")
        if (!response.ok) throw new Error("Failed to fetch")
        const result = await response.json()
        if (result.error) throw new Error(result.error)
        setData(result)
      } catch (err) {
        setError("Unable to load activity data")
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [])

  const toggleEventExpanded = (eventId: string) => {
    setExpandedEvents((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(eventId)) {
        newSet.delete(eventId)
      } else {
        newSet.add(eventId)
      }
      return newSet
    })
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "push":
        return GitCommit
      case "pr-opened":
        return GitPullRequest
      case "pr-merged":
        return GitMerge
      case "pr-closed":
        return GitPullRequest
      case "issue-opened":
      case "issue-closed":
        return CircleDot
      case "review":
        return Eye
      case "comment":
      case "commit-comment":
      case "review-comment":
        return MessageSquare
      case "fork":
        return GitFork
      case "star":
        return Star
      case "repo-created":
        return FolderPlus
      case "branch-created":
        return GitBranch
      case "tag-created":
        return Tag
      case "delete":
        return Trash2
      case "release":
        return Package
      default:
        return GitCommit
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "push":
        return "text-cyan-400"
      case "pr-opened":
        return "text-purple-400"
      case "pr-merged":
        return "text-green-400"
      case "pr-closed":
        return "text-red-400"
      case "issue-opened":
        return "text-yellow-400"
      case "issue-closed":
        return "text-emerald-400"
      case "review":
        return "text-blue-400"
      case "comment":
      case "commit-comment":
      case "review-comment":
        return "text-pink-400"
      case "fork":
        return "text-orange-400"
      case "star":
        return "text-amber-400"
      case "repo-created":
        return "text-teal-400"
      case "branch-created":
        return "text-indigo-400"
      case "tag-created":
        return "text-violet-400"
      case "delete":
        return "text-red-400"
      case "release":
        return "text-lime-400"
      default:
        return "text-slate-400"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 text-purple-500 animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-center py-4">
        <p className="text-slate-500 text-sm">{error || "No activity data available"}</p>
      </div>
    )
  }

  const { summary, recentRepos, detailedEvents } = data

  // Build activity items to display (only show non-zero stats)
  const activityItems = [
    { icon: GitCommit, label: "commits pushed", value: summary.commits, color: "text-cyan-400" },
    { icon: GitPullRequest, label: "PRs opened", value: summary.pullRequestsOpened, color: "text-purple-400" },
    { icon: GitMerge, label: "PRs merged", value: summary.pullRequestsMerged, color: "text-green-400" },
    { icon: CircleDot, label: "issues opened", value: summary.issuesOpened, color: "text-yellow-400" },
    { icon: CircleDot, label: "issues closed", value: summary.issuesClosed, color: "text-emerald-400" },
    { icon: Eye, label: "code reviews", value: summary.reviews, color: "text-blue-400" },
    { icon: MessageSquare, label: "comments", value: summary.comments, color: "text-pink-400" },
    { icon: GitFork, label: "repos forked", value: summary.forks, color: "text-orange-400" },
    { icon: Star, label: "repos starred", value: summary.stars, color: "text-amber-400" },
    { icon: FolderPlus, label: "repos created", value: summary.reposCreated, color: "text-teal-400" },
  ].filter((item) => item.value > 0)

  return (
    <div className="space-y-6 flex flex-col items-center w-full">
      {/* Activity Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 justify-items-center w-full max-w-4xl">
        {activityItems.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={index}
              className="flex flex-col items-center p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300"
            >
              <Icon className={`h-5 w-5 ${item.color} mb-2`} />
              <span className="text-2xl font-bold text-slate-100">{item.value}</span>
              <span className="text-xs text-slate-500 text-center">{item.label}</span>
            </div>
          )
        })}
      </div>

     </div>
  )
}
