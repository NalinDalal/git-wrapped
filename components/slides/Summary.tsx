"use client";
import { motion } from "motion/react";
import { useState } from "react";

export default function Summary({ stats }: any) {
    const [mode, setMode] = useState<"card" | "receipt">("card");

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] p-6 relative">

            {/* Mode Toggle */}
            <div className="absolute top-20 right-6 z-20 flex bg-white/10 rounded-full p-1 backdrop-blur-md">
                <button
                    onClick={() => setMode("card")}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === "card" ? "bg-white text-black" : "text-white/50"}`}
                >
                    Card
                </button>
                <button
                    onClick={() => setMode("receipt")}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === "receipt" ? "bg-white text-black" : "text-white/50"}`}
                >
                    Receipt
                </button>
            </div>

            {mode === "card" ? (
                /* ==================== CARD MODE ==================== */
                <motion.div
                    key="card"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full max-w-sm aspect-[4/5] bg-black rounded-[2rem] p-1 overflow-hidden"
                >
                    {/* Animated Border Gradient */}
                    <div className="absolute inset-[-50%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#4ade80_100%)] opacity-70" />

                    {/* Card Content */}
                    <div className="absolute inset-[2px] bg-[#0A0A0A] rounded-[1.9rem] p-8 flex flex-col justify-between">

                        {/* Header */}
                        <div className="flex items-center gap-3 border-b border-white/10 pb-6">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
                                <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="font-bold text-xl text-white">Git Wrapped</h2>
                                <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">2025 Edition</p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 py-8">
                            <div className="col-span-2 p-6 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-zinc-500 text-xs uppercase mb-1">Total Contributions</p>
                                <p className="text-4xl font-black text-white">{stats.totalCommits.toLocaleString()}</p>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-900/20 rounded-2xl border border-green-500/20">
                                <p className="text-green-200/60 text-xs uppercase mb-1">Top Lang</p>
                                <p className="text-xl font-bold text-green-400 truncate">
                                    {stats.topLanguages?.[0] || "N/A"}
                                </p>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-orange-500/20 to-red-900/20 rounded-2xl border border-orange-500/20">
                                <p className="text-orange-200/60 text-xs uppercase mb-1">Best Streak</p>
                                <p className="text-xl font-bold text-orange-400">{stats.longestStreak} days</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center pt-6 border-t border-white/10">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-white text-black font-bold text-xs mb-3">
                                {stats.commitRank}
                            </div>
                            <p className="text-zinc-600 text-xs">Wrapped for developers</p>
                        </div>
                    </div>
                </motion.div>
            ) : (
                /* ==================== RECEIPT MODE ==================== */
                <motion.div
                    key="receipt"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white text-black font-mono p-6 w-full max-w-sm shadow-2xl relative"
                    style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.2))" }}
                >
                    {/* Jagged Top */}
                    <div className="absolute -top-2 left-0 w-full h-4 bg-white" style={{ clipPath: "polygon(0 100%, 5% 0, 10% 100%, 15% 0, 20% 100%, 25% 0, 30% 100%, 35% 0, 40% 100%, 45% 0, 50% 100%, 55% 0, 60% 100%, 65% 0, 70% 100%, 75% 0, 80% 100%, 85% 0, 90% 100%, 95% 0, 100% 100%)" }} />

                    <div className="text-center mb-6 mt-4">
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Git Wrapped</h2>
                        <p className="text-xs uppercase">2025 Order #001</p>
                        <p className="text-xs">Served to: Developer</p>
                    </div>

                    <div className="border-t-2 border-dashed border-black/20 py-4 space-y-2 text-sm uppercase">
                        <div className="flex justify-between">
                            <span>Total Commits</span>
                            <span className="font-bold">{stats.totalCommits}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Day Streak</span>
                            <span className="font-bold">{stats.longestStreak}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Active Month</span>
                            <span className="font-bold">{stats.mostActiveMonth?.name || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Top Lang</span>
                            <span className="font-bold">{stats.topLanguages?.[0] || "N/A"}</span>
                        </div>
                        <div className="flex justify-between text-black/50">
                            <span>Sleep Lost</span>
                            <span>∞</span>
                        </div>
                    </div>

                    <div className="border-t-2 border-dashed border-black/20 pt-4 pb-8 text-center">
                        <p className="text-3xl font-black">{stats.commitRank}</p>
                        <p className="text-[10px] mt-2">THANK YOU FOR CODING</p>
                        <div className="mt-4 flex justify-center opacity-80">
                            <div className="h-8 w-48 flex gap-1 justify-center">
                                {[...Array(20)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-black"
                                        style={{
                                            width: Math.random() > 0.5 ? 4 : 2,
                                            height: "100%",
                                            opacity: Math.random() > 0.3 ? 1 : 0.5
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Jagged Bottom */}
                    <div className="absolute -bottom-2 left-0 w-full h-4 bg-white" style={{ clipPath: "polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)" }} />
                </motion.div>
            )}
        </div>
    );
}