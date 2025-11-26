"use client"

import { useState } from "react"
import { ExternalLink, Github } from "lucide-react"
import { ContributionHeatmap } from "@/components/github/contribution-heatmap"
import { ActivitySummary } from "@/components/github/activity-summary"

const GITHUB_USERNAME = "Eacaw"

export function GitHubActivitySection() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  return (
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
          <p className="mt-4 text-slate-400">My open source contributions and recent activity</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-slate-200 mb-6 text-center">Contribution Graph</h3>
          <ContributionHeatmap selectedYear={selectedYear} onYearChange={setSelectedYear} />

          {/* Activity Summary inside the same card */}
          <div className="mt-8 pt-8 border-t border-slate-800">
            <h4 className="text-lg font-semibold text-slate-200 mb-4 text-center">Recent Activity Summary</h4>
            <ActivitySummary />
          </div>
        </div>

        {/* View More Link */}
        <div className="text-center mt-8">
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-purple-500/50 hover:text-purple-400 transition-all duration-300"
          >
            <Github className="h-5 w-5" />
            View Full Profile
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
