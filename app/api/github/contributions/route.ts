import { NextResponse } from "next/server"

const GITHUB_ACCOUNTS = [
  { username: "Eacaw", tokenEnvVar: "GITHUB_PAT" },
  { username: "davep-gh", tokenEnvVar: "GITHUB_PAT_WORK" },
]

interface ContributionDay {
  contributionCount: number
  date: string
  weekday: number
}

interface ContributionWeek {
  contributionDays: ContributionDay[]
}

async function fetchContributionsForAccount(
  username: string,
  token: string | undefined,
  from: string | null,
  to: string | null
): Promise<{ totalContributions: number; weeks: ContributionWeek[] } | null> {
  if (!token) {
    console.error(`No token for ${username}`)
    return null
  }

  const query = `
    query($username: String!, $from: DateTime, $to: DateTime) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                weekday
              }
            }
          }
        }
      }
    }
  `

  const variables = { username, from, to }

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    })

    if (!response.ok) {
      console.error(`Failed to fetch contributions for ${username}`)
      return null
    }

    const data = await response.json()

    if (data.errors) {
      console.error(`GraphQL error for ${username}:`, data.errors[0]?.message)
      return null
    }

    const calendar = data.data?.user?.contributionsCollection?.contributionCalendar
    return {
      totalContributions: calendar?.totalContributions || 0,
      weeks: calendar?.weeks || [],
    }
  } catch (error) {
    console.error(`Error fetching contributions for ${username}:`, error)
    return null
  }
}

function combineContributions(
  results: ({ totalContributions: number; weeks: ContributionWeek[] } | null)[]
): { totalContributions: number; weeks: ContributionWeek[] } {
  const validResults = results.filter((r): r is { totalContributions: number; weeks: ContributionWeek[] } => r !== null)

  if (validResults.length === 0) {
    return { totalContributions: 0, weeks: [] }
  }

  if (validResults.length === 1) {
    return validResults[0]
  }

  // Combine contributions by date
  const contributionsByDate = new Map<string, ContributionDay>()

  for (const result of validResults) {
    for (const week of result.weeks) {
      for (const day of week.contributionDays) {
        const existing = contributionsByDate.get(day.date)
        if (existing) {
          existing.contributionCount += day.contributionCount
        } else {
          contributionsByDate.set(day.date, { ...day })
        }
      }
    }
  }

  // Rebuild weeks structure from combined data
  const sortedDates = Array.from(contributionsByDate.keys()).sort()
  const weeks: ContributionWeek[] = []
  let currentWeek: ContributionDay[] = []

  for (const date of sortedDates) {
    const day = contributionsByDate.get(date)!
    currentWeek.push(day)

    // Start new week on Sunday (weekday 0)
    if (day.weekday === 6 || date === sortedDates[sortedDates.length - 1]) {
      weeks.push({ contributionDays: currentWeek })
      currentWeek = []
    }
  }

  const totalContributions = Array.from(contributionsByDate.values()).reduce(
    (sum, day) => sum + day.contributionCount,
    0
  )

  return { totalContributions, weeks }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get("year")

  let from: string | null = null
  let to: string | null = null

  if (year) {
    const yearNum = Number.parseInt(year)
    from = `${yearNum}-01-01T00:00:00Z`
    to = `${yearNum}-12-31T23:59:59Z`
  }

  try {
    // Fetch contributions from all accounts in parallel
    const results = await Promise.all(
      GITHUB_ACCOUNTS.map((account) =>
        fetchContributionsForAccount(account.username, process.env[account.tokenEnvVar], from, to)
      )
    )

    const combined = combineContributions(results)

    return NextResponse.json(combined)
  } catch (error) {
    console.error("GitHub API error:", error)
    return NextResponse.json({ error: "Failed to fetch contribution data" }, { status: 500 })
  }
}
