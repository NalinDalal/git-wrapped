"use client";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import React from "react";

export default function CommitRank({ stats }: any) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    function handleMouseMove(e: React.MouseEvent) {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    }

    const isElite = stats.commitRank.includes("0.5") || stats.commitRank.includes("1%");

    return (
        <div
            className="w-full h-full flex items-center justify-center bg-[#050505] overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
        >
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] bg-purple-900/30 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-blue-900/20 rounded-full blur-[120px]" />

            <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative w-[90%] max-w-md aspect-[3/4]"
            >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden group">

                    {/* Holographic Shine */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="h-full flex flex-col justify-between p-10 relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-2xl bg-white/5">
                                {isElite ? "🏆" : "🎖️"}
                            </div>
                            <div className="text-right">
                                <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Rank</p>
                                <p className="text-sm font-mono text-white/70">#2025</p>
                            </div>
                        </div>

                        <div className="space-y-4 text-center transform translate-z-10">
                            <h2 className="text-lg text-zinc-400 font-medium tracking-wide uppercase">You reached the</h2>
                            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
                                {stats.commitRank}
                            </h1>
                        </div>

                        <div className="space-y-4">
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                                    className={`h-full bg-linear-to-r ${isElite ? "from-yellow-400 to-amber-600" : "from-blue-400 to-purple-600"}`}
                                />
                            </div>
                            <p className="text-center text-sm text-zinc-500">
                                Top contributor percentile
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}