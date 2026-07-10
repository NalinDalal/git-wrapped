"use client";
import { motion } from "motion/react";
import { calculateBadges } from "@/lib/gamification";

export default function Achievements({ stats }: any) {
    const badges = calculateBadges(stats);

    return (
        <div className="w-full h-full flex flex-col justify-center p-8 bg-[#09090b] relative">
            <div className="max-w-md mx-auto w-full">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-white mb-2"
                >
                    Achievements
                </motion.h2>
                <p className="text-zinc-500 text-sm mb-8">Badges unlocked this year</p>

                <div className="grid gap-3">
                    {badges.map((badge, index) => (
                        <motion.div
                            key={badge.id}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative flex items-center gap-4 p-4 rounded-xl border ${
                                badge.unlocked
                                    ? "bg-white/5 border-white/10"
                                    : "bg-black/40 border-white/5 opacity-50 grayscale"
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                                badge.unlocked ? "bg-linear-to-br from-yellow-400/20 to-orange-500/20 border border-orange-500/30" : "bg-white/5"
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