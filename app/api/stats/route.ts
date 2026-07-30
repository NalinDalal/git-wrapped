import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import type { GitHubStats, ContributionDay, GraphQLResponse } from "@/types/github";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 10;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) return false;

  record.count++;
  return true;
}

/**
 * Determines the user's commit rank based on their total number of contributions
 * These thresholds are approximations based on general GitHub activity patterns
 */
function getCommitRank(totalCommits: number): string {
  if (totalCommits >= 5000) return "Top 0.5%-1%";
  if (totalCommits >= 2000) return "Top 1%-3%";
  if (totalCommits >= 1000) return "Top 5%-10%";
  if (totalCommits >= 500) return "Top 10%-15%";
  if (totalCommits >= 200) return "Top 25%-30%";
  if (totalCommits >= 50) return "Median 50%";
  return "Bottom 30%";
}

// Constants for date formatting
const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/**
 * GitHub Stats API endpoint
 * Fetches and processes a user's GitHub statistics including:
 * - Contribution data
 * - Commit patterns
 * - Repository stars
 * - Programming languages
 *
 * @param request - Incoming HTTP request with 'username' query parameter
 * @returns JSON response with processed GitHub statistics
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0] || "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const octokit = new Octokit({ auth: GITHUB_TOKEN });

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username || !/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(username) || username.length > 39) {
      return NextResponse.json(
        { error: "Username parameter is required" },
        { status: 400 },
      );
    }

    // GraphQL query to fetch user's GitHub data
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
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
          repositories(first: 100, orderBy: {field: STARGAZERS, direction: DESC}) {
            nodes {
              stargazerCount
              primaryLanguage {
                name
              }
            }
          }
        }
      }
    `;

    const graphqlResponse = (await octokit.graphql(query, { username })) as GraphQLResponse;
    const userData = graphqlResponse.user;

    // Process contribution data for the current year
    const contributionDays =
      userData.contributionsCollection.contributionCalendar.weeks
        .flatMap((week) => week.contributionDays)
        .filter((day) => new Date(day.date) >= new Date(`${new Date().getFullYear()}-01-01`));

    // Calculate monthly contribution statistics
    const monthlyCommits: Record<string, number> = {};
    contributionDays.forEach((day: ContributionDay) => {
      const month = new Date(day.date).getMonth() + 1;
      const monthKey = month.toString().padStart(2, "0");
      monthlyCommits[monthKey] =
        (monthlyCommits[monthKey] || 0) + day.contributionCount;
    });

    // Calculate daily contribution patterns
    const dailyCommits: Record<string, number> = {};
    contributionDays.forEach((day: ContributionDay) => {
      dailyCommits[day.weekday] =
        (dailyCommits[day.weekday] || 0) + day.contributionCount;
    });

    // Find peak activity periods
    const sortedMonths = Object.entries(monthlyCommits).sort(
      ([, a], [, b]) => b - a,
    );

    const sortedDays = Object.entries(dailyCommits).sort(
      ([, a], [, b]) => b - a,
    );

    // Calculate repository statistics
    const totalStars = userData.repositories.nodes.reduce(
      (acc, repo) => acc + repo.stargazerCount,
      0,
    );

    // Process programming language statistics
    const languages = userData.repositories.nodes.reduce<Record<string, number>>(
      (acc, repo) => {
        if (repo.primaryLanguage?.name) {
          acc[repo.primaryLanguage.name] =
            (acc[repo.primaryLanguage.name] || 0) + 1;
        }
        return acc;
      },
      {},
    );

    const topLanguages = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([lang]) => lang);

    const topLanguagesCount = Object.fromEntries(
      Object.entries(languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
    );

    // Calculate contribution streaks
    let currentStreak = 0;
    let maxStreak = 0;
    for (const day of contributionDays) {
      if (day.contributionCount > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    const totalCommits =
      userData.contributionsCollection.contributionCalendar.totalContributions;

    const sortedWeeks = contributionDays.length / 7 || 1;

    // Prepare and return the final statistics
    const stats: GitHubStats = {
      longestStreak: maxStreak,
      totalCommits,
      commitRank: getCommitRank(totalCommits),
      calendarData: contributionDays,
      mostActiveDay: sortedDays.length > 0
        ? {
            name: WEEKDAY_NAMES[parseInt(sortedDays[0][0])],
            commits: Math.round(sortedDays[0][1] / sortedWeeks),
          }
        : { name: "N/A", commits: 0 },
      mostActiveMonth: sortedMonths.length > 0
        ? {
            name: MONTH_NAMES[parseInt(sortedMonths[0][0]) - 1],
            commits: sortedMonths[0][1],
          }
        : { name: "N/A", commits: 0 },
      starsEarned: totalStars,
      topLanguages,
      topLanguagesCount,
    };

    return NextResponse.json(stats);
  } catch (error: unknown) {
    console.error("Error fetching GitHub stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub statistics" },
      { status: 500 },
    );
  }
}
