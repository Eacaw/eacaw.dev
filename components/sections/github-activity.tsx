"use client"

import { ExternalLink, Github } from "lucide-react"
import { ContributionHeatmap } from "@/components/github/contribution-heatmap"
import { ActivityTimeline } from "@/components/github/activity-timeline"
import { GitHubDataProvider } from "@/contexts/github-data-context"
import { ActivitySummary } from "@/components/github/activity-summary"

const GITHUB_ACCOUNTS = [
  { username: "Eacaw", label: "Personal" },
  { username: "davep-gh", label: "Work" },
]

export function GitHubActivitySection() {
  return (
    <GitHubDataProvider>
      <section id="github" className="py-24 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-32 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <Github className="h-8 w-8 text-purple-400" />
              <h2 className="text-3xl sm:text-4xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  GitHub Activity
                </span>
              </h2>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full" />
            <p className="mt-4 text-slate-400">My yearly GitHub contributions and recent activity</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-slate-200 mb-6 text-center">Contribution Graph</h3>
            <ContributionHeatmap />

            {/* Activity Summary inside the same card */}
          <div className="mt-8 pt-8 border-t border-slate-800">
            <h4 className="text-lg font-semibold text-slate-200 mb-4 text-center">Recent Activity Summary</h4>
            <ActivitySummary />
          </div>

            {/* Activity Timeline inside the same card */}
            <div className="mt-8 pt-8 border-t border-slate-800">
              <h4 className="text-lg font-semibold text-slate-200 mb-4 text-center">Last 14 Days Activity</h4>
              <ActivityTimeline />
            </div>
          </div>

          {/* View More Links */}
          <div className="text-center mt-8 flex flex-wrap gap-4 justify-center">
            {GITHUB_ACCOUNTS.map((account) => (
              <a
                key={account.username}
                href={`https://github.com/${account.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-purple-500/50 hover:text-purple-400 transition-all duration-300"
              >
                <Github className="h-5 w-5" />
                {account.label} Profile
                <ExternalLink className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </GitHubDataProvider>
  )
}
