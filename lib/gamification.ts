// lib/gamification.ts

export type PersonaType = "The Machine" | "The Architect" | "The Fixer" | "The Artist" | "The Ghost";

interface Badge {
    id: string;
    icon: string;
    title: string;
    description: string;
    unlocked: boolean;
}

export function calculatePersona(stats: any) {
    const { totalCommits, longestStreak, topLanguages, starsEarned } = stats;

    // Power Levels (0-100)
    const power = {
        strength: Math.min(100, Math.floor((totalCommits / 1000) * 100)), // Commits
        agility: Math.min(100, topLanguages.length * 20), // Languages
        endurance: Math.min(100, Math.floor((longestStreak / 30) * 100)), // Streak
        wisdom: Math.min(100, starsEarned * 5), // Stars
    };

    // Determine Class
    let characterClass: PersonaType = "The Fixer";
    let quote = "You get things done.";

    if (power.endurance > 80) {
        characterClass = "The Machine";
        quote = "Sleep is optional. Commits are eternal.";
    } else if (power.agility > 80) {
        characterClass = "The Architect";
        quote = "You speak in many tongues and build worlds.";
    } else if (power.strength > 90) {
        characterClass = "The Artist";
        quote = "Your code is your canvas, and you paint daily.";
    } else if (totalCommits < 50) {
        characterClass = "The Ghost";
        quote = "Rarely seen, but your impact is felt.";
    }

    return { class: characterClass, quote, power };
}

export function calculateBadges(stats: any): Badge[] {
    return [
        {
            id: "streak_master",
            icon: "🔥",
            title: "Wildfire",
            description: "Hit a 14+ day streak",
            unlocked: stats.longestStreak >= 14
        },
        {
            id: "polyglot",
            icon: "🧠",
            title: "Polyglot",
            description: "Used 5+ languages",
            unlocked: stats.topLanguages.length >= 5
        },
        {
            id: "weekend_warrior",
            icon: "⚔️",
            title: "Weekend Warrior",
            description: "Most active day was Sat/Sun",
            unlocked: ["Saturday", "Sunday"].includes(stats.mostActiveDay.name)
        },
        {
            id: "stargazer",
            icon: "⭐",
            title: "Stargazer",
            description: "Earned your first star",
            unlocked: stats.starsEarned > 0
        },
        {
            id: "elite",
            icon: "🏆",
            title: "Top 1%",
            description: "Reached the top 1% of contributors",
            unlocked: stats.commitRank.includes("1%") || stats.commitRank.includes("0.5%")
        }
    ];
}