"use client";
import { motion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";
import { Star } from "lucide-react";
import type { GitHubStats } from "@/types/github";

function Counter({ value }: { value: number }) {
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span>{display}</motion.span>;
}

export default function StarsEarned({ stats }: { stats: GitHubStats }) {
    const stars = stats.starsEarned || 0;

    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-[#0a0a0a] relative overflow-hidden">
            {/* Floating stars background */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 0,
                        x: Math.random() * 800 - 400,
                        y: Math.random() * 600 - 300,
                    }}
                    animate={{
                        opacity: [0, 0.3, 0],
                        y: [0, -50],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                    }}
                    className="absolute"
                >
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </motion.div>
            ))}

            {/* Central glow */}
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute w-[400px] h-[400px] bg-yellow-500/20 rounded-full blur-[100px]"
            />

            <div className="relative z-10 text-center">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mb-8"
                >
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600">
                        <Star className="w-12 h-12 text-white fill-white" />
                    </div>
                </motion.div>

                <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 tracking-tighter">
                    <Counter value={stars} />
                </h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-2xl text-white/50 font-light"
                >
                    Stars earned across repositories
                </motion.p>
            </div>
        </div>
    );
}
