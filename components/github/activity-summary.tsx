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
} from "lucide-react"

interface ActivitySummary {
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

interface ActivityData {
  summary: ActivitySummary
  recentRepos: string[]
  totalEvents: number
}

export function ActivitySummary() {
  const [data, setData] = useState<ActivityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const { summary, recentRepos } = data

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

      {/* Recent Repos */}
      {recentRepos.length > 0 && (
        <div className="pt-4 border-t border-slate-800 w-full max-w-4xl">
          <p className="text-sm text-slate-500 mb-3 text-center">Recently active in:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {recentRepos.map((repo, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-purple-500/50 hover:text-purple-400 transition-colors"
              >
                {repo}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
