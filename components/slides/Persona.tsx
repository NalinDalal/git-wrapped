"use client";
import { motion } from "motion/react";
import { calculatePersona } from "@/lib/gamification";
import { Radar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

export default function Persona({ stats }: any) {
    const persona = calculatePersona(stats);

    const data = {
        labels: ["STR", "AGI", "END", "WIS"],
        datasets: [
            {
                label: "Power Stats",
                data: [
                    persona.power.strength,
                    persona.power.agility,
                    persona.power.endurance,
                    persona.power.wisdom,
                ],
                backgroundColor: "rgba(34, 197, 94, 0.2)",
                borderColor: "#4ade80",
                borderWidth: 2,
            },
        ],
    };

    const options = {
        scales: {
            r: {
                angleLines: { color: "rgba(255, 255, 255, 0.1)" },
                grid: { color: "rgba(255, 255, 255, 0.1)" },
                pointLabels: { color: "white", font: { size: 12 } },
                ticks: { display: false, maxTicksLimit: 5 },
                suggestedMin: 0,
                suggestedMax: 100,
            },
        },
        plugins: { legend: { display: false } },
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-black relative overflow-hidden">
            {/* Glitchy Background */}
            <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/xT9IgN8YK5MBoz82ws/giphy.gif')] opacity-5 mix-blend-screen pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
            >
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <motion.p
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-xs text-green-400 font-mono uppercase tracking-widest mb-1"
                        >
                            Class Detected
                        </motion.p>
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl font-black text-white italic"
                        >
                            {persona.class.toUpperCase()}
                        </motion.h1>
                    </div>
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                        🤖
                    </div>
                </div>

                {/* Radar Chart */}
                <div className="w-full aspect-square max-h-[250px] mx-auto mb-6">
                    <Radar data={data} options={options} />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center space-y-4"
                >
                    <p className="text-zinc-400 text-sm italic">&#34;{persona.quote}&#34;</p>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono text-zinc-500 mt-4 border-t border-white/10 pt-4">
                        <div className="bg-black/40 p-2 rounded">STR: {persona.power.strength}</div>
                        <div className="bg-black/40 p-2 rounded">AGI: {persona.power.agility}</div>
                        <div className="bg-black/40 p-2 rounded">END: {persona.power.endurance}</div>
                        <div className="bg-black/40 p-2 rounded">WIS: {persona.power.wisdom}</div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}