import { NextResponse } from "next/server"

const GITHUB_USERNAME = "Eacaw"

export async function GET(request: Request) {
  const token = process.env.GITHUB_PAT
  const { searchParams } = new URL(request.url)
  const year = searchParams.get("year")

  if (!token) {
    return NextResponse.json({ error: "GitHub PAT not configured" }, { status: 500 })
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

  let variables: Record<string, string | null> = { username: GITHUB_USERNAME, from: null, to: null }

  if (year) {
    const yearNum = Number.parseInt(year)
    variables = {
      username: GITHUB_USERNAME,
      from: `${yearNum}-01-01T00:00:00Z`,
      to: `${yearNum}-12-31T23:59:59Z`,
    }
  }

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch from GitHub")
    }

    const data = await response.json()

    if (data.errors) {
      throw new Error(data.errors[0]?.message || "GraphQL error")
    }

    const calendar = data.data?.user?.contributionsCollection?.contributionCalendar

    return NextResponse.json({
      totalContributions: calendar?.totalContributions || 0,
      weeks: calendar?.weeks || [],
    })
  } catch (error) {
    console.error("GitHub API error:", error)
    return NextResponse.json({ error: "Failed to fetch contribution data" }, { status: 500 })
  }
}
