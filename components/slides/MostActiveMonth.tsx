"use client";
import { motion } from "motion/react";
import type { GitHubStats } from "@/types/github";

const monthAbbr: Record<string, string> = {
    January: "JAN", February: "FEB", March: "MAR", April: "APR",
    May: "MAY", June: "JUN", July: "JUL", August: "AUG",
    September: "SEP", October: "OCT", November: "NOV", December: "DEC",
};

export default function MostActiveMonth({ stats }: { stats: GitHubStats }) {
    const monthName = stats.mostActiveMonth?.name || "January";
    const commitCount = stats.mostActiveMonth?.commits || 0;

    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-black relative overflow-hidden">
            {/* Background gradient */}
            <motion.div
                animate={{
                    rotate: [0, 360],
                }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[80px]"
            />

            <div className="relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm uppercase tracking-widest text-white/40 font-bold mb-8"
                >
                    Peak Performance
                </motion.div>

                <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mb-8"
                >
                    <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/30 leading-none">
                        {monthAbbr[monthName] || "JAN"}
                    </div>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold text-white mb-4"
                >
                    {monthName}
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20"
                >
                    <span className="text-2xl">🚀</span>
                    <span className="text-white/70">{commitCount} commits</span>
                </motion.div>
            </div>
        </div>
    );
}
