"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomizePanel from "@/components/CustomizePanel";
import { useRouter } from "next/navigation";
import type { WrappedConfig } from "@/types/wrapped";
import { Github, Play, Settings2, Sparkles } from "lucide-react";

export default function Home() {
    const [username, setUsername] = useState("");
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [showCustomize, setShowCustomize] = useState(false);
    const router = useRouter();

    async function handleFetch(e?: React.FormEvent) {
        e?.preventDefault();
        if (!username) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/stats?username=${username}`);
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    const handleGenerate = (config: WrappedConfig) => {
        sessionStorage.setItem("wrappedConfig", JSON.stringify(config));
        sessionStorage.setItem("wrappedStats", JSON.stringify(stats));
        router.push("/wrapped");
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-purple-500/30">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 h-screen flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    {!stats ? (
                        // STATE 1: INPUT
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-md text-center space-y-8"
                        >
                            <div className="space-y-2">
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    className="inline-block p-3 rounded-2xl bg-white/5 border border-white/10 mb-4"
                                >
                                    <Github className="w-8 h-8" />
                                </motion.div>
                                <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
                                    Git Wrapped
                                </h1>
                                <p className="text-white/50 text-lg">
                                    Your 2025 coding story awaits.
                                </p>
                            </div>

                            <form onSubmit={handleFetch} className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                                <div className="relative flex gap-2 bg-[#0A0A0A] p-2 rounded-xl border border-white/10">
                                    <Input
                                        placeholder="github_username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="bg-transparent border-none text-lg h-12 focus-visible:ring-0 placeholder:text-white/20"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="h-12 px-8 bg-white text-black hover:bg-gray-200 font-bold rounded-lg transition-all"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        ) : (
                                            "Reveal"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        // STATE 2: PREVIEW & CUSTOMIZE
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-4xl grid md:grid-cols-2 gap-12 items-center"
                        >
                            {/* Left: The "Cover" Card */}
                            <div className="order-2 md:order-1 relative aspect-[4/5] md:aspect-square max-h-[600px] w-full">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-[2rem] blur-xl" />
                                <div className="relative h-full bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden group">
                                    {/* Decorative Noise/Grain could go here */}

                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-white/50 uppercase tracking-widest">2025 Wrapped</p>
                                        <h2 className="text-3xl font-bold">@{username}</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-6xl font-black text-white">
                                                {stats.totalCommits}
                                            </span>
                                            <span className="text-xl text-white/50">commits</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10">
                                            <span className="text-sm font-medium">{stats.commitRank}</span>
                                        </div>
                                        <Sparkles className="w-8 h-8 text-yellow-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </div>

                            {/* Right: Controls */}
                            <div className="order-1 md:order-2 space-y-8">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold">Your Year in Code</h2>
                                    <p className="text-white/50">Ready to watch your story?</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {/* We use a hidden generated config or a default one if CustomizePanel isn't shown */}
                                    {!showCustomize ? (
                                        <>
                                            <Button
                                                onClick={() => handleGenerate({ theme: "neon", slides: ["totalCommits", "commitRank", "topLanguages", "longestStreak", "summary"] })}
                                                className="h-14 text-lg bg-white text-black hover:bg-gray-200 rounded-xl font-bold flex items-center gap-2 justify-center group"
                                            >
                                                <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                                                Play Wrapped
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowCustomize(true)}
                                                className="h-14 text-lg border-white/10 hover:bg-white/5 hover:text-white rounded-xl flex items-center gap-2 justify-center"
                                            >
                                                <Settings2 className="w-5 h-5" />
                                                Customize
                                            </Button>
                                        </>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-[#111] p-6 rounded-2xl border border-white/10"
                                        >
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-semibold">Story Settings</h3>
                                                <button onClick={() => setShowCustomize(false)} className="text-xs text-white/50 hover:text-white">Close</button>
                                            </div>
                                            <CustomizePanel stats={stats} onGenerate={handleGenerate} />
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}