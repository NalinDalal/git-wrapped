# Git Wrapped

**Your GitHub year, wrapped.** A Spotify Wrapped-style animated recap of your coding activity, built with Next.js.

Enter a GitHub username, and Git Wrapped pulls their contribution data via the GitHub GraphQL API, then plays back an animated slideshow of their year in code, with customizable slides and a gamification layer.

## How it works

1. Enter a GitHub username on the homepage
2. The app fetches contribution data (commits, stars, languages, streaks) via the GitHub GraphQL API
3. Preview your stats on a cover card, then customize which slides to include
4. Hit "Play Wrapped" for an animated, slide-by-slide recap of your coding year

## Slides

Each slide is a self-contained, animated component:

| Slide | What it shows |
|---|---|
| `intro` | Animated GitHub logo + username reveal |
| `totalCommits` | Total contributions with animated counter |
| `commitRank` | Percentile ranking based on commit count |
| `topLanguages` | Top 3 languages from your repos |
| `mostActiveDay` | Day of the week you code most |
| `mostActiveMonth` | Month with highest activity |
| `longestStreak` | Longest consecutive-day streak |
| `starsEarned` | Total stars across all repos |
| `persona` | Assigns a character class based on your stats |
| `achievements` | Unlockable badges (Wildfire, Polyglot, Weekend Warrior, etc.) |
| `summary` | Final recap card |

## Gamification

Based on your stats, you get assigned a persona:

- **The Machine** - 30+ day streak
- **The Architect** - 5+ languages
- **The Artist** - 1000+ commits
- **The Ghost** - fewer than 50 commits
- **The Fixer** - everyone else

Plus unlockable badges: Wildfire (14+ day streak), Polyglot (5+ languages), Weekend Warrior (most active on Sat/Sun), Stargazer (earned a star), Top 1% (elite commit count).

## Stack

- **Framework:** Next.js 16 + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui (Radix primitives)
- **Animations:** Framer Motion (`motion` package)
- **Charts:** Chart.js + react-chartjs-2
- **GitHub API:** Octokit (GraphQL)
- **Package manager:** Bun

## Getting started

```bash
# Clone
git clone https://github.com/nalindalal/git-wrapped.git
cd git-wrapped

# Install dependencies
bun install

# Set up environment variable
cp .env.example .env.local
```

Add your GitHub token to `.env.local`:

```
GITHUB_TOKEN=ghp_your_token_here
```

You need a [GitHub personal access token](https://github.com/settings/tokens) with `read:user` and `repo:read` scopes.

```bash
# Run dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

Edit `wrapped.config.ts` to change defaults:

```ts
export const defaultWrappedConfig: WrappedConfig = {
    theme: "neon",          // "neon" | "dark" | "minimal"
    accentColor: "#ba0c0c",
    font: "Inter",
    slides: [
        "intro", "totalCommits", "commitRank", "topLanguages",
        "mostActiveDay", "mostActiveMonth", "longestStreak",
        "starsEarned", "summary",
    ],
    animations: "smooth",   // "smooth" | "fast" | "none"
    showHeatmap: true,
};
```

## License

MIT
