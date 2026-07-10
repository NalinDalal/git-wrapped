"use client";
import { motion } from "motion/react";

export default function Streak({ stats }: any) {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-black relative overflow-hidden">

            {/* Pulsing Core */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[100px]"
            />

            <div className="relative z-10 text-center">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="text-8xl mb-6 inline-block"
                >
                    🔥
                </motion.div>

                <h1 className="text-[10rem] leading-none font-black text-white mix-blend-overlay tracking-tighter">
                    {stats.longestStreak}
                </h1>

                <div className="bg-red-500 text-black font-bold text-xl px-6 py-2 rounded-full inline-block transform -rotate-2 mt-4">
                    DAY STREAK
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 flex gap-1 justify-center opacity-50"
                >
                    {/* Visual calendar grid representation */}
                    {[...Array(7)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 10 }}
                            animate={{ height: Math.random() * 40 + 20 }}
                            transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                            className="w-4 bg-white rounded-full"
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    );
}