export type WrappedSlide =
    | "totalCommits"
    | "commitRank"
    | "topLanguages"
    | "longestStreak"
    | "summary"
    | 'persona'
    | 'achievements';

export interface WrappedConfig {
    theme: "neon" | "dark" | "minimal";
    slides: WrappedSlide[];
}
