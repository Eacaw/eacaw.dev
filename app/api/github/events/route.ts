import { NextResponse } from "next/server"

const GITHUB_USERNAME = "Eacaw"

export interface DetailedEvent {
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
    const detailedEvents: DetailedEvent[] = []

    for (const event of events) {
      const repoName = event.repo?.name?.split("/")[1] || event.repo?.name
      const fullRepoName = event.repo?.name || repoName
      if (repoName) recentRepos.add(repoName)

      const baseEvent = {
        id: event.id,
        repo: repoName,
        repoUrl: `https://github.com/${fullRepoName}`,
        timestamp: event.created_at,
      }

      switch (event.type) {
        case "PushEvent": {
          summary.pushes++
          const commitCount = event.payload?.commits?.length || 0
          summary.commits += commitCount
          const branch = event.payload?.ref?.replace("refs/heads/", "") || "unknown"
          const commits = (event.payload?.commits || []).map((c: { sha: string; message: string }) => ({
            sha: c.sha?.substring(0, 7),
            message: c.message?.split("\n")[0] || "No message",
          }))
          detailedEvents.push({
            ...baseEvent,
            type: "push",
            description: `Pushed ${commitCount} commit${commitCount !== 1 ? "s" : ""} to ${branch}`,
            details: {
              branch,
              commits,
              url: `https://github.com/${fullRepoName}/commits/${branch}`,
            },
          })
          break
        }
        case "PullRequestEvent": {
          const pr = event.payload?.pull_request
          const action = event.payload?.action
          if (action === "opened") {
            summary.pullRequestsOpened++
            detailedEvents.push({
              ...baseEvent,
              type: "pr-opened",
              description: `Opened PR #${pr?.number}: ${pr?.title || "Untitled"}`,
              details: {
                title: pr?.title,
                body: pr?.body?.substring(0, 200) || undefined,
                url: pr?.html_url,
                number: pr?.number,
                action: "opened",
              },
            })
          } else if (action === "closed") {
            if (pr?.merged) {
              summary.pullRequestsMerged++
              detailedEvents.push({
                ...baseEvent,
                type: "pr-merged",
                description: `Merged PR #${pr?.number}: ${pr?.title || "Untitled"}`,
                details: {
                  title: pr?.title,
                  url: pr?.html_url,
                  number: pr?.number,
                  action: "merged",
                },
              })
            } else {
              summary.pullRequestsClosed++
              detailedEvents.push({
                ...baseEvent,
                type: "pr-closed",
                description: `Closed PR #${pr?.number}: ${pr?.title || "Untitled"}`,
                details: {
                  title: pr?.title,
                  url: pr?.html_url,
                  number: pr?.number,
                  action: "closed",
                },
              })
            }
          }
          break
        }
        case "IssuesEvent": {
          const issue = event.payload?.issue
          const action = event.payload?.action
          if (action === "opened") {
            summary.issuesOpened++
            detailedEvents.push({
              ...baseEvent,
              type: "issue-opened",
              description: `Opened issue #${issue?.number}: ${issue?.title || "Untitled"}`,
              details: {
                title: issue?.title,
                body: issue?.body?.substring(0, 200) || undefined,
                url: issue?.html_url,
                number: issue?.number,
                action: "opened",
              },
            })
          } else if (action === "closed") {
            summary.issuesClosed++
            detailedEvents.push({
              ...baseEvent,
              type: "issue-closed",
              description: `Closed issue #${issue?.number}: ${issue?.title || "Untitled"}`,
              details: {
                title: issue?.title,
                url: issue?.html_url,
                number: issue?.number,
                action: "closed",
              },
            })
          }
          break
        }
        case "PullRequestReviewEvent": {
          summary.reviews++
          const pr = event.payload?.pull_request
          const review = event.payload?.review
          const state = review?.state || "reviewed"
          detailedEvents.push({
            ...baseEvent,
            type: "review",
            description: `${state.charAt(0).toUpperCase() + state.slice(1)} PR #${pr?.number}: ${pr?.title || "Untitled"}`,
            details: {
              title: pr?.title,
              url: review?.html_url || pr?.html_url,
              number: pr?.number,
              action: state,
            },
          })
          break
        }
        case "IssueCommentEvent": {
          summary.comments++
          const issue = event.payload?.issue
          const comment = event.payload?.comment
          const isPR = !!issue?.pull_request
          detailedEvents.push({
            ...baseEvent,
            type: "comment",
            description: `Commented on ${isPR ? "PR" : "issue"} #${issue?.number}: ${issue?.title || "Untitled"}`,
            details: {
              title: issue?.title,
              body: comment?.body?.substring(0, 150) || undefined,
              url: comment?.html_url,
              number: issue?.number,
            },
          })
          break
        }
        case "CommitCommentEvent": {
          summary.comments++
          const comment = event.payload?.comment
          detailedEvents.push({
            ...baseEvent,
            type: "commit-comment",
            description: `Commented on commit ${comment?.commit_id?.substring(0, 7) || "unknown"}`,
            details: {
              body: comment?.body?.substring(0, 150) || undefined,
              url: comment?.html_url,
            },
          })
          break
        }
        case "PullRequestReviewCommentEvent": {
          summary.comments++
          const pr = event.payload?.pull_request
          const comment = event.payload?.comment
          detailedEvents.push({
            ...baseEvent,
            type: "review-comment",
            description: `Review comment on PR #${pr?.number}: ${pr?.title || "Untitled"}`,
            details: {
              title: pr?.title,
              body: comment?.body?.substring(0, 150) || undefined,
              url: comment?.html_url,
              number: pr?.number,
            },
          })
          break
        }
        case "ForkEvent": {
          summary.forks++
          const forkee = event.payload?.forkee
          detailedEvents.push({
            ...baseEvent,
            type: "fork",
            description: `Forked ${fullRepoName}`,
            details: {
              url: forkee?.html_url,
            },
          })
          break
        }
        case "WatchEvent": {
          summary.stars++
          detailedEvents.push({
            ...baseEvent,
            type: "star",
            description: `Starred ${fullRepoName}`,
            details: {
              url: `https://github.com/${fullRepoName}`,
            },
          })
          break
        }
        case "CreateEvent": {
          const refType = event.payload?.ref_type
          if (refType === "repository") {
            summary.reposCreated++
            detailedEvents.push({
              ...baseEvent,
              type: "repo-created",
              description: `Created repository ${repoName}`,
              details: {
                url: `https://github.com/${fullRepoName}`,
              },
            })
          } else if (refType === "branch") {
            const branch = event.payload?.ref
            detailedEvents.push({
              ...baseEvent,
              type: "branch-created",
              description: `Created branch ${branch} in ${repoName}`,
              details: {
                branch,
                url: `https://github.com/${fullRepoName}/tree/${branch}`,
              },
            })
          } else if (refType === "tag") {
            const tag = event.payload?.ref
            detailedEvents.push({
              ...baseEvent,
              type: "tag-created",
              description: `Created tag ${tag} in ${repoName}`,
              details: {
                url: `https://github.com/${fullRepoName}/releases/tag/${tag}`,
              },
            })
          }
          break
        }
        case "DeleteEvent": {
          const refType = event.payload?.ref_type
          const ref = event.payload?.ref
          detailedEvents.push({
            ...baseEvent,
            type: "delete",
            description: `Deleted ${refType} ${ref} in ${repoName}`,
            details: {
              branch: refType === "branch" ? ref : undefined,
            },
          })
          break
        }
        case "ReleaseEvent": {
          const release = event.payload?.release
          const action = event.payload?.action
          if (action === "published") {
            detailedEvents.push({
              ...baseEvent,
              type: "release",
              description: `Published release ${release?.tag_name || "unknown"}: ${release?.name || "Untitled"}`,
              details: {
                title: release?.name,
                body: release?.body?.substring(0, 200) || undefined,
                url: release?.html_url,
              },
            })
          }
          break
        }
      }
    }

    return NextResponse.json({
      summary,
      recentRepos: Array.from(recentRepos).slice(0, 5),
      totalEvents: events.length,
      detailedEvents: detailedEvents.slice(0, 50), // Limit to most recent 50 events
    })
  } catch (error) {
    console.error("GitHub events error:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
