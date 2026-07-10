import TotalCommits from "./slides/TotalCommits";
import CommitRank from "./slides/CommitRank";
import TopLanguages from "./slides/TopLanguages";
import Streak from "./slides/Streak";
import Summary from "./slides/Summary";
import Persona from "./slides/Persona";
import Achievements from "./slides/Achievements";

export default function SlideRenderer({slide, stats, onNext}: any) {
    const common = {stats, onNext};

    switch (slide) {
        case "totalCommits":
            return <TotalCommits {...common} />;
        case "commitRank":
            return <CommitRank {...common} />;
        case "topLanguages":
            return <TopLanguages {...common} />;
        case "longestStreak":
            return <Streak {...common} />;
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
