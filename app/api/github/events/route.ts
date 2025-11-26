import { NextResponse } from "next/server"

const GITHUB_USERNAME = "Eacaw"

export async function GET() {
  const token = process.env.GITHUB_PAT

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=500`, { headers })

    if (!response.ok) {
      throw new Error("Failed to fetch events")
    }

    const events = await response.json()

    const summary = {
      pushes: 0,
      commits: 0,
      pullRequestsOpened: 0,
      pullRequestsClosed: 0,
      pullRequestsMerged: 0,
      issuesOpened: 0,
      issuesClosed: 0,
      reviews: 0,
      comments: 0,
      forks: 0,
      stars: 0,
      reposCreated: 0,
    }

    const recentRepos = new Set<string>()

    for (const event of events) {
      const repoName = event.repo?.name?.split("/")[1] || event.repo?.name
      if (repoName) recentRepos.add(repoName)

      switch (event.type) {
        case "PushEvent":
          summary.pushes++
          summary.commits += event.payload?.commits?.length || 0
          break
        case "PullRequestEvent":
          if (event.payload?.action === "opened") summary.pullRequestsOpened++
          if (event.payload?.action === "closed") {
            if (event.payload?.pull_request?.merged) {
              summary.pullRequestsMerged++
            } else {
              summary.pullRequestsClosed++
            }
          }
          break
        case "IssuesEvent":
          if (event.payload?.action === "opened") summary.issuesOpened++
          if (event.payload?.action === "closed") summary.issuesClosed++
          break
        case "PullRequestReviewEvent":
          summary.reviews++
          break
        case "IssueCommentEvent":
        case "CommitCommentEvent":
        case "PullRequestReviewCommentEvent":
          summary.comments++
          break
        case "ForkEvent":
          summary.forks++
          break
        case "WatchEvent":
          summary.stars++
          break
        case "CreateEvent":
          if (event.payload?.ref_type === "repository") summary.reposCreated++
          break
      }
    }

    return NextResponse.json({
      summary,
      recentRepos: Array.from(recentRepos).slice(0, 5),
      totalEvents: events.length,
    })
  } catch (error) {
    console.error("GitHub events error:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
