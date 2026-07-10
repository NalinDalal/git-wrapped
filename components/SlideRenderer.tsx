import TotalCommits from "./slides/TotalCommits";
import CommitRank from "./slides/CommitRank";
import TopLanguages from "./slides/TopLanguages";
import Streak from "./slides/Streak";
import Summary from "./slides/Summary";
import Persona from "./slides/Persona";
import Achievements from "./slides/Achievements";
import Intro from "./slides/Intro";
import MostActiveDay from "./slides/MostActiveDay";
import MostActiveMonth from "./slides/MostActiveMonth";
import StarsEarned from "./slides/StarsEarned";
import { WrappedSlide } from "@/types/wrapped";

interface SlideRendererProps {
    slide: WrappedSlide;
    stats: any; // TODO: Define proper GitHubStats interface
    onNext?: () => void;
}

export default function SlideRenderer({ slide, stats, onNext }: SlideRendererProps) {
    const common = { stats, onNext };

    switch (slide) {
        case "intro":
            return <Intro {...common} />;
        case "totalCommits":
            return <TotalCommits {...common} />;
        case "commitRank":
            return <CommitRank {...common} />;
        case "topLanguages":
            return <TopLanguages {...common} />;
        case "mostActiveDay":
            return <MostActiveDay {...common} />;
        case "mostActiveMonth":
            return <MostActiveMonth {...common} />;
        case "longestStreak":
            return <Streak {...common} />;
        case "starsEarned":
            return <StarsEarned {...common} />;
        case "summary":
            return <Summary {...common} />;
        case "persona":
            return <Persona {...common} />;
        case "achievements":
            return <Achievements {...common} />;
        default:
            return null;
    }
}
