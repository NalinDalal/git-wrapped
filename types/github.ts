export interface ContributionDay {
  contributionCount: number;
  date: string;
  weekday: number;
}

export interface GitHubStats {
  longestStreak: number;
  totalCommits: number;
  commitRank: string;
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
  username?: string;
}
