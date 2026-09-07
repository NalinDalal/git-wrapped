"use client";
import { motion } from "motion/react";
import { calculateBadges } from "@/lib/gamification";
import type { GitHubStats } from "@/types/github";

export default function Achievements({ stats }: { stats: GitHubStats }) {
    const badges = calculateBadges(stats);
    const unlockedCount = badges.filter(b => b.unlocked).length;

    return (
        <div className="w-full h-full flex flex-col justify-center p-8 bg-[#09090b] relative">
            <div className="max-w-md mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">Unlocked</p>
                    <div className="flex items-baseline gap-3">
                        <h2 className="text-5xl font-black text-white">{unlockedCount}</h2>
                        <span className="text-lg text-white/30">/ {badges.length}</span>
                    </div>
                </motion.div>

                <div className="grid gap-3">
                    {badges.map((badge, index) => (
                        <motion.div
                            key={badge.id}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative flex items-center gap-4 p-4 rounded-xl border ${badge.unlocked
                                ? "bg-white/5 border-white/10"
                                : "bg-black/40 border-white/5 opacity-50 grayscale"
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                                badge.unlocked
                                    ? "bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-orange-500/30"
                                    : "bg-white/5"
                            }`}>
                                {badge.icon}
                            </div>

                            <div>
                                <h3 className={`font-bold text-sm ${badge.unlocked ? "text-white" : "text-zinc-500"}`}>
                                    {badge.title}
                                </h3>
                                <p className="text-xs text-zinc-500">{badge.description}</p>
                            </div>

                            {badge.unlocked && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5 + (index * 0.1), type: "spring" }}
                                    className="absolute right-4"
                                >
                                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" />
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
