import { WrappedConfig } from "./types/wrapped";
export const defaultWrappedConfig: WrappedConfig = {
    theme: "neon",
    accentColor: "#ba0c0c",
    font: "Inter",
    slides: [
        "intro",
        "totalCommits",
        "commitRank",
        "topLanguages",
        "mostActiveDay",
        "mostActiveMonth",
        "longestStreak",
        "heatmap",
        "starsEarned",
        "summary",
    ],
    animations: "smooth",
    showHeatmap: true,
};
