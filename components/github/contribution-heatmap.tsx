"use client"

import { useState, useEffect } from "react"
import { Loader2, ChevronDown } from "lucide-react"

interface ContributionDay {
  contributionCount: number
  date: string
  weekday: number
}

interface ContributionWeek {
  contributionDays: ContributionDay[]
}

interface ContributionData {
  totalContributions: number
  weeks: ContributionWeek[]
}

interface ContributionHeatmapProps {
  selectedYear: number
  onYearChange: (year: number) => void
}

export function ContributionHeatmap({ selectedYear, onYearChange }: ContributionHeatmapProps) {
  const [data, setData] = useState<ContributionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null)
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false)

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i)

  useEffect(() => {
    const fetchContributions = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/github/contributions?year=${selectedYear}`)
        if (!response.ok) throw new Error("Failed to fetch")
        const result = await response.json()
        if (result.error) throw new Error(result.error)
        setData(result)
      } catch (err) {
        setError("Unable to load contribution data")
      } finally {
        setLoading(false)
      }
    }

    fetchContributions()
  }, [selectedYear])

  const getContributionColor = (count: number) => {
    if (count === 0) return "bg-slate-800/50"
    if (count <= 3) return "bg-purple-900/60"
    if (count <= 6) return "bg-purple-700/70"
    if (count <= 9) return "bg-purple-500/80"
    return "bg-cyan-400"
  }

  const getContributionGlow = (count: number) => {
    if (count === 0) return ""
    if (count <= 3) return "shadow-[0_0_4px_rgba(168,85,247,0.3)]"
    if (count <= 6) return "shadow-[0_0_6px_rgba(168,85,247,0.5)]"
    if (count <= 9) return "shadow-[0_0_8px_rgba(168,85,247,0.7)]"
    return "shadow-[0_0_10px_rgba(34,211,238,0.8)]"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const getMonthLabels = () => {
    if (!data?.weeks?.length) return []

    const labels: { month: string; index: number }[] = []
    let lastMonth = -1

    data.weeks.forEach((week, weekIndex) => {
      const firstDay = week.contributionDays[0]
      if (firstDay) {
        const month = new Date(firstDay.date).getMonth()
        if (month !== lastMonth) {
          labels.push({ month: months[month], index: weekIndex })
          lastMonth = month
        }
      }
    })

    return labels
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">{error}</p>
        <p className="text-sm text-slate-500 mt-2">Make sure GITHUB_PAT environment variable is configured</p>
      </div>
    )
  }

  const monthLabels = getMonthLabels()

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-6 flex items-center justify-center gap-4 flex-wrap">
        <div className="relative">
          <button
            onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 transition-colors"
          >
            <span className="text-slate-200 font-medium">{selectedYear}</span>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform ${isYearDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isYearDropdownOpen && (
            <div className="absolute top-full mt-2 left-0 z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
              {yearOptions.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    onYearChange(year)
                    setIsYearDropdownOpen(false)
                  }}
                  className={`block w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors ${
                    year === selectedYear ? "text-purple-400 bg-slate-700/50" : "text-slate-300"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="text-center">
          <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {data?.totalContributions.toLocaleString()}
          </span>
          <span className="text-slate-400 ml-2">contributions in {selectedYear}</span>
        </div>
      </div>

      {/* Heatmap Container */}
      <div className="flex justify-center w-full overflow-x-auto pb-4">
        <div className="inline-block">
          {/* Month Labels */}
          <div className="relative flex mb-2 ml-8 h-4">
            {monthLabels.map(({ month, index }, i) => (
              <div
                key={`${month}-${i}`}
                className="text-xs text-slate-500 absolute"
                style={{
                  left: `${index * 14}px`,
                }}
              >
                {month}
              </div>
            ))}
          </div>

          {/* Day Labels + Grid */}
          <div className="flex mt-2">
            <div className="flex flex-col gap-[3px] mr-2 text-xs text-slate-500">
              <span className="h-[12px]"></span>
              <span className="h-[12px] leading-[12px]">Mon</span>
              <span className="h-[12px]"></span>
              <span className="h-[12px] leading-[12px]">Wed</span>
              <span className="h-[12px]"></span>
              <span className="h-[12px] leading-[12px]">Fri</span>
              <span className="h-[12px]"></span>
            </div>

            <div className="flex gap-[3px]">
              {data?.weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.contributionDays.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-[12px] h-[12px] rounded-sm ${getContributionColor(day.contributionCount)} ${getContributionGlow(day.contributionCount)} transition-all duration-200 hover:scale-125 cursor-pointer border border-slate-700/30`}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {hoveredDay && (
        <div
          className="fixed pointer-events-none z-50 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 shadow-xl text-sm"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <p className="font-medium text-slate-200">
            {hoveredDay.contributionCount} contribution{hoveredDay.contributionCount !== 1 ? "s" : ""}
          </p>
          <p className="text-slate-400 text-xs">{formatDate(hoveredDay.date)}</p>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-[12px] h-[12px] rounded-sm bg-slate-800/50 border border-slate-700/30" />
          <div className="w-[12px] h-[12px] rounded-sm bg-purple-900/60 border border-slate-700/30" />
          <div className="w-[12px] h-[12px] rounded-sm bg-purple-700/70 border border-slate-700/30" />
          <div className="w-[12px] h-[12px] rounded-sm bg-purple-500/80 border border-slate-700/30" />
          <div className="w-[12px] h-[12px] rounded-sm bg-cyan-400 border border-slate-700/30" />
        </div>
        <span>More</span>
      </div>
    </div>
  )
}
