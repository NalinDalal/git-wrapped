"use client";
import { motion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

function Counter({ value }: { value: number }) {
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span>{display}</motion.span>;
}

export default function TotalCommits({ stats }: any) {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-black relative overflow-hidden perspective-1000">
            {/* Hyper-speed Tunnel */}
            <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full border border-white/20"
                        initial={{ width: 0, height: 0, opacity: 0 }}
                        animate={{
                            width: ["0vw", "150vw"],
                            height: ["0vh", "150vh"],
                            opacity: [0, 0.5, 0],
                            borderWidth: ["1px", "5px"]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeIn",
                            delay: i * 0.1,
                        }}
                    />
                ))}
            </div>

            <motion.div className="relative z-10 text-center mix-blend-screen">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-4 py-1 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-widest mb-8"
                >
                    2025 Activity
                </motion.div>

                <h1 className="text-8xl md:text-9xl font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                    <Counter value={stats.totalCommits} />
                </h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-4 text-xl md:text-2xl text-zinc-400 font-light"
                >
                    Commits shipped to the world
                </motion.p>
            </motion.div>
        </div>
    );
}