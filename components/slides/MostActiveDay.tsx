"use client";
import { motion } from "motion/react";
import { useMemo } from "react";
import type { GitHubStats } from "@/types/github";

const dayColors: Record<string, string> = {
    Monday: "from-blue-500 to-cyan-500",
    Tuesday: "from-purple-500 to-pink-500",
    Wednesday: "from-green-500 to-emerald-500",
    Thursday: "from-orange-500 to-yellow-500",
    Friday: "from-red-500 to-rose-500",
    Saturday: "from-indigo-500 to-violet-500",
    Sunday: "from-teal-500 to-cyan-500",
};

export default function MostActiveDay({ stats }: { stats: GitHubStats }) {
    const dayName = stats.mostActiveDay?.name || "Monday";
    const commitCount = stats.mostActiveDay?.commits || 0;
    const colorClass = dayColors[dayName] || "from-purple-500 to-blue-500";

    const dayIndicators = useMemo(() =>
        Object.keys(dayColors).map((d, i) => ({
            name: d,
            x: (((i * 137.508) % 200) - 100),
            y: (((i * 97.3) % 200) - 100),
        })),
    []);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-[#050505] relative overflow-hidden">
            {/* Floating day indicators */}
            {dayIndicators.map((d, i) => (
                <motion.div
                    key={d.name}
                    initial={{ opacity: 0, x: d.x, y: d.y }}
                    animate={{
                        opacity: d.name === dayName ? 0.3 : 0.05,
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.2,
                    }}
                    className={`absolute w-24 h-24 rounded-full bg-gradient-to-br ${dayColors[d.name]} blur-2xl`}
                />
            ))}

            <div className="relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm uppercase tracking-widest text-white/40 font-bold mb-8"
                >
                    Your Power Day
                </motion.div>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className={`inline-block px-8 py-4 rounded-2xl bg-gradient-to-r ${colorClass} mb-8`}
                >
                    <h1 className="text-6xl md:text-7xl font-black text-white drop-shadow-lg">
                        {dayName}
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl text-white/50"
                >
                    {commitCount} commits shipped
                </motion.p>
            </div>
        </div>
    );
}
