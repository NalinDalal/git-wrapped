export type WrappedSlide =
    | "intro"
    | "totalCommits"
    | "commitRank"
    | "topLanguages"
    | "mostActiveDay"
    | "mostActiveMonth"
    | "longestStreak"
    | "starsEarned"
    | "summary"
    | "persona"
    | "achievements"
    | "heatmap";

export interface WrappedConfig {
    theme: "neon" | "dark" | "minimal";
    accentColor: string;
    font: string;
    slides: WrappedSlide[];
    animations: "smooth" | "fast" | "none";
    showHeatmap: boolean;
}
