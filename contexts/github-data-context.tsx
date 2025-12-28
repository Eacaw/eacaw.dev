"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"

// Types for contribution data (heatmap)
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

// Types for events data (timeline)
interface DetailedEvent {
  id: string
  type: string
  repo: string
  repoUrl: string
  timestamp: string
  description: string
  account: string
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

interface EventsData {
  summary: ActivitySummaryStats
  recentRepos: string[]
  totalEvents: number
  detailedEvents: DetailedEvent[]
}

interface GitHubDataContextType {
  // Contribution data
  contributionData: ContributionData | null
  contributionLoading: boolean
  contributionError: string | null
  selectedYear: number
  setSelectedYear: (year: number) => void
  
  // Events data
  eventsData: EventsData | null
  eventsLoading: boolean
  eventsError: string | null
  
  // Refresh functions
  refreshContributions: () => Promise<void>
  refreshEvents: () => Promise<void>
}

const GitHubDataContext = createContext<GitHubDataContextType | null>(null)

export function GitHubDataProvider({ children }: { children: ReactNode }) {
  // Contribution state
  const [contributionData, setContributionData] = useState<ContributionData | null>(null)
  const [contributionLoading, setContributionLoading] = useState(true)
  const [contributionError, setContributionError] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Events state
  const [eventsData, setEventsData] = useState<EventsData | null>(null)
  const [eventsLoading, setEventsLoading] = useState(true)
  const [eventsError, setEventsError] = useState<string | null>(null)

  const fetchContributions = useCallback(async () => {
    setContributionLoading(true)
    setContributionError(null)
    try {
      const response = await fetch(`/api/github/contributions?year=${selectedYear}`)
      if (!response.ok) throw new Error("Failed to fetch")
      const result = await response.json()
      if (result.error) throw new Error(result.error)
      setContributionData(result)
    } catch (err) {
      setContributionError("Unable to load contribution data")
    } finally {
      setContributionLoading(false)
    }
  }, [selectedYear])

  const fetchEvents = useCallback(async () => {
    setEventsLoading(true)
    setEventsError(null)
    try {
      const response = await fetch("/api/github/events")
      if (!response.ok) throw new Error("Failed to fetch")
      const result = await response.json()
      if (result.error) throw new Error(result.error)
      setEventsData(result)
    } catch (err) {
      setEventsError("Unable to load activity data")
    } finally {
      setEventsLoading(false)
    }
  }, [])

  // Fetch contributions when year changes
  useEffect(() => {
    fetchContributions()
  }, [fetchContributions])

  // Fetch events on mount
  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return (
    <GitHubDataContext.Provider
      value={{
        contributionData,
        contributionLoading,
        contributionError,
        selectedYear,
        setSelectedYear,
        eventsData,
        eventsLoading,
        eventsError,
        refreshContributions: fetchContributions,
        refreshEvents: fetchEvents,
      }}
    >
      {children}
    </GitHubDataContext.Provider>
  )
}

export function useGitHubData() {
  const context = useContext(GitHubDataContext)
  if (!context) {
    throw new Error("useGitHubData must be used within a GitHubDataProvider")
  }
  return context
}
