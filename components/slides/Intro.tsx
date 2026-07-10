"use client";
import { motion } from "motion/react";
import { Github } from "lucide-react";
import type { GitHubStats } from "@/types/github";

export default function Intro({ stats }: { stats: GitHubStats }) {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-black relative overflow-hidden">
            {/* Animated background rings */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full border border-white/10"
                    initial={{ width: 100, height: 100, opacity: 0 }}
                    animate={{
                        width: [100, 800],
                        height: [100, 800],
                        opacity: [0.5, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 0.8,
                        ease: "easeOut",
                    }}
                />
            ))}

            <div className="relative z-10 text-center">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="inline-block p-6 rounded-full bg-white/5 border border-white/20 mb-8"
                >
                    <Github className="w-16 h-16 text-white" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-7xl md:text-8xl font-black text-white tracking-tighter mb-4"
                >
                    Git Wrapped
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-2xl text-white/50 font-light"
                >
                    Your 2025 coding story
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="mt-12 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 border border-white/20"
                >
                    <span className="text-white/70">@</span>
                    <span className="text-white font-bold">{stats.username || "developer"}</span>
                </motion.div>
            </div>
        </div>
    );
}
