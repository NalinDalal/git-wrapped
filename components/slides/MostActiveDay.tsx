"use client";
import { motion } from "motion/react";

const dayColors: Record<string, string> = {
    Monday: "from-blue-500 to-cyan-500",
    Tuesday: "from-purple-500 to-pink-500",
    Wednesday: "from-green-500 to-emerald-500",
    Thursday: "from-orange-500 to-yellow-500",
    Friday: "from-red-500 to-rose-500",
    Saturday: "from-indigo-500 to-violet-500",
    Sunday: "from-teal-500 to-cyan-500",
};

export default function MostActiveDay({ stats }: any) {
    const day = stats.mostActiveDay || "Monday";
    const colorClass = dayColors[day] || "from-purple-500 to-blue-500";

    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-[#050505] relative overflow-hidden">
            {/* Floating day indicators */}
            {Object.keys(dayColors).map((d, i) => (
                <motion.div
                    key={d}
                    initial={{ opacity: 0, x: Math.random() * 200 - 100, y: Math.random() * 200 - 100 }}
                    animate={{
                        opacity: d === day ? 0.3 : 0.05,
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.2,
                    }}
                    className={`absolute w-24 h-24 rounded-full bg-gradient-to-br ${dayColors[d]} blur-2xl`}
                />
            ))}

            <div className="relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm uppercase tracking-widest text-white/40 font-bold mb-8"
                >
                    Your Power Day
                </motion.div>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className={`inline-block px-8 py-4 rounded-2xl bg-gradient-to-r ${colorClass} mb-8`}
                >
                    <h1 className="text-6xl md:text-7xl font-black text-white drop-shadow-lg">
                        {day}
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl text-white/50"
                >
                    {stats.mostActiveDayCommits || "Most"} commits shipped
                </motion.p>
            </div>
        </div>
    );
}
