"use client"

import { useState, useMemo } from "react"
import {
  Loader2,
  GitCommit,
  GitPullRequest,
  GitMerge,
  CircleDot,
  GitFork,
  Star,
  FolderPlus,
  Eye,
  Tag,
  Trash2,
  Package,
  Code,
  LucideIcon,
} from "lucide-react"
import { format, subDays, parseISO, startOfDay } from "date-fns"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { useGitHubData } from "@/contexts/github-data-context"

interface EventType {
  key: string
  label: string
  color: string
  icon: LucideIcon
  sourceTypes: string[]
}

// Combined event types for cleaner display
const EVENT_TYPES: EventType[] = [
  { key: "code-contributions", label: "Code Contributions", color: "#22d3ee", icon: GitCommit, sourceTypes: ["push", "branch-created"] },
  { key: "prs", label: "PRs", color: "#a855f7", icon: GitPullRequest, sourceTypes: ["pr-opened", "pr-closed"] },
  { key: "pr-merged", label: "PRs Merged", color: "#22c55e", icon: GitMerge, sourceTypes: ["pr-merged"] },
  { key: "issues", label: "Issues", color: "#eab308", icon: CircleDot, sourceTypes: ["issue-opened", "issue-closed", "comment"] },
  { key: "code-reviews", label: "Code Reviews", color: "#3b82f6", icon: Eye, sourceTypes: ["review", "review-comment"] },
  { key: "fork", label: "Forks", color: "#f97316", icon: GitFork, sourceTypes: ["fork"] },
  { key: "star", label: "Stars", color: "#fbbf24", icon: Star, sourceTypes: ["star"] },
  { key: "repo-created", label: "Repos Created", color: "#14b8a6", icon: FolderPlus, sourceTypes: ["repo-created"] },
  { key: "tag-created", label: "Tags Created", color: "#8b5cf6", icon: Tag, sourceTypes: ["tag-created"] },
  { key: "delete", label: "Deletions", color: "#ef4444", icon: Trash2, sourceTypes: ["delete"] },
  { key: "release", label: "Releases", color: "#84cc16", icon: Package, sourceTypes: ["release"] },
]

interface ChartDataPoint {
  date: string
  displayDate: string
  [key: string]: string | number
}

export function ActivityTimeline() {
  const { eventsData: data, eventsLoading: loading, eventsError: error } = useGitHubData()
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set(EVENT_TYPES.map(t => t.key)))

  const chartData = useMemo((): ChartDataPoint[] => {
    if (!data?.detailedEvents) return []

    const today = startOfDay(new Date())
    const days: Record<string, Record<string, number>> = {}

    // Initialize last 14 days
    for (let i = 13; i >= 0; i--) {
      const date = format(subDays(today, i), "yyyy-MM-dd")
      days[date] = {}
      EVENT_TYPES.forEach(type => {
        days[date][type.key] = 0
      })
    }

    // Count events by day and combined type
    for (const event of data.detailedEvents) {
      const eventDate = format(startOfDay(parseISO(event.timestamp)), "yyyy-MM-dd")
      if (!days[eventDate]) continue
      
      // Find which combined type this event belongs to
      const combinedType = EVENT_TYPES.find(t => t.sourceTypes.includes(event.type))
      if (combinedType) {
        days[eventDate][combinedType.key]++
      }
    }

    // Convert to array for recharts
    return Object.entries(days).map(([date, counts]) => ({
      date,
      displayDate: format(parseISO(date), "MMM d"),
      ...counts,
    }))
  }, [data])

  const toggleType = (typeKey: string) => {
    setActiveTypes(prev => {
      // If clicking the only active type, do nothing
      if (prev.size === 1 && prev.has(typeKey)) {
        return prev
      }
      // If this type is already the only one selected, show all
      if (prev.size === 1 && !prev.has(typeKey)) {
        return new Set([typeKey])
      }
      // Otherwise, select only this type
      return new Set([typeKey])
    })
  }

  const selectAllTypes = () => {
    setActiveTypes(new Set(EVENT_TYPES.map(t => t.key)))
  }

  // Get only types that have at least one event in the data
  const activeEventTypes = useMemo(() => {
    if (!chartData.length) return []
    return EVENT_TYPES.filter(type => 
      chartData.some(day => (day[type.key] as number) > 0)
    )
  }, [chartData])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 text-purple-500 animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 text-sm">{error || "No activity data available"}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Chart */}
        <div className="flex-1 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barCategoryGap={0} barGap={0}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={true} 
                horizontal={false} 
                stroke="#334155"
              />
              <XAxis 
                dataKey="displayDate" 
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={{ stroke: "#475569" }}
                axisLine={{ stroke: "#475569" }}
                interval={1}
                tickCount={14}
              />
              <YAxis 
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={{ stroke: "#475569" }}
                axisLine={{ stroke: "#475569" }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                }}
                labelStyle={{ color: "#e2e8f0", fontWeight: "bold" }}
                cursor={{ fill: "rgba(168, 85, 247, 0.1)" }}
              />
              {activeEventTypes
                .filter(type => activeTypes.has(type.key))
                .map(type => (
                  <Bar
                    key={type.key}
                    dataKey={type.key}
                    name={type.label}
                    fill={type.color}
                    radius={[2, 2, 0, 0]}
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend / Filter */}
        <div className="lg:w-48 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-slate-300">Filter by Type</h4>
            <button
              onClick={selectAllTypes}
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              Show All
            </button>
          </div>
          <div className="flex flex-wrap lg:flex-col gap-2">
            {activeEventTypes.map(type => {
              const isActive = activeTypes.has(type.key)
              const Icon = type.icon
              return (
                <button
                  key={type.key}
                  onClick={() => toggleType(type.key)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                    isActive
                      ? "bg-slate-800/80 border border-slate-600 text-slate-200"
                      : "bg-slate-800/30 border border-slate-700/50 text-slate-500"
                  } hover:border-purple-500/50`}
                  title={`Show only ${type.label}`}
                >
                  <Icon
                    className="w-3.5 h-3.5 flex-shrink-0"
                    style={{ color: isActive ? type.color : "#64748b" }}
                  />
                  <span className="truncate">{type.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
