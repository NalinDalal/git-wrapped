export interface ContributionDay {
  contributionCount: number;
  date: string;
  weekday: number;
}

export interface GraphQLResponse {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: Array<{
          contributionDays: ContributionDay[];
        }>;
      };
    };
    repositories: {
      nodes: Array<{
        stargazerCount: number;
        primaryLanguage: {
          name: string;
        } | null;
      }>;
    };
  };
}

export interface GitHubStats {
  longestStreak: number;
  totalCommits: number;
  commitRank: string;
  rankTitle: string;
  rankIcon: string;
  calendarData: ContributionDay[];
  mostActiveDay: {
    name: string;
    commits: number;
  };
  mostActiveMonth: {
    name: string;
    commits: number;
  };
  starsEarned: number;
  topLanguages: string[];
  topLanguagesCount: Record<string, number>;
  username?: string;
}
