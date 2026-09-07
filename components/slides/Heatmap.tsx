"use client";
import { motion } from "motion/react";
import { useMemo } from "react";
import type { GitHubStats } from "@/types/github";

function getIntensity(count: number, max: number): number {
    if (count === 0) return 0;
    const ratio = count / max;
    if (ratio < 0.25) return 1;
    if (ratio < 0.5) return 2;
    if (ratio < 0.75) return 3;
    return 4;
}

const LEVELS = [
    "bg-white/5",
    "bg-green-900/60",
    "bg-green-700/70",
    "bg-green-500/80",
    "bg-green-400",
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function Heatmap({ stats }: { stats: GitHubStats }) {
    const { weeks, maxCount, totalDays, activeDays } = useMemo(() => {
        const data = stats.calendarData || [];
        const max = Math.max(...data.map(d => d.contributionCount), 1);
        const active = data.filter(d => d.contributionCount > 0).length;

        // Group by week (7 days each)
        const weekGrid: typeof data[] = [];
        for (let i = 0; i < data.length; i += 7) {
            weekGrid.push(data.slice(i, i + 7));
        }

        return { weeks: weekGrid, maxCount: max, totalDays: data.length, activeDays: active };
    }, [stats.calendarData]);

    // Get month label positions
    const monthLabels = useMemo(() => {
        const labels: { month: string; weekIndex: number }[] = [];
        let lastMonth = -1;
        weeks.forEach((week, i) => {
            if (week.length > 0) {
                const month = new Date(week[0].date).getMonth();
                if (month !== lastMonth) {
                    labels.push({ month: MONTHS[month], weekIndex: i });
                    lastMonth = month;
                }
            }
        });
        return labels;
    }, [weeks]);

    const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-[#050505] p-6 relative overflow-hidden">
            <div className="relative z-10 w-full max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">Activity</p>
                    <div className="flex items-baseline gap-3">
                        <h2 className="text-5xl font-black text-white">{stats.totalCommits.toLocaleString()}</h2>
                        <span className="text-lg text-white/30">contributions</span>
                    </div>
                    <p className="text-sm text-white/20 mt-1">
                        {activeDays} active days out of {totalDays}
                    </p>
                </motion.div>

                {/* Month labels */}
                <div className="flex ml-8 mb-1">
                    {monthLabels.map(({ month, weekIndex }) => (
                        <div
                            key={month + weekIndex}
                            className="text-[10px] text-white/20 font-mono"
                            style={{ position: "absolute", left: `${(weekIndex / weeks.length) * 100}%` }}
                        >
                            {month}
                        </div>
                    ))}
                </div>

                <div className="flex gap-0">
                    {/* Day labels */}
                    <div className="flex flex-col gap-[3px] mr-2 mt-0">
                        {dayLabels.map((label, i) => (
                            <div key={i} className="h-[10px] flex items-center text-[9px] text-white/20 font-mono">
                                {label}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex gap-[3px]"
                    >
                        {weeks.map((week, wi) => (
                            <div key={wi} className="flex flex-col gap-[3px]">
                                {week.map((day, di) => {
                                    const level = getIntensity(day.contributionCount, maxCount);
                                    return (
                                        <motion.div
                                            key={day.date}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                                delay: 0.3 + wi * 0.01 + di * 0.005,
                                                duration: 0.15,
                                            }}
                                            className={`w-[10px] h-[10px] rounded-[2px] ${LEVELS[level]} transition-colors`}
                                            title={`${day.date}: ${day.contributionCount} contributions`}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Legend */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="flex items-center gap-2 mt-4 ml-8"
                >
                    <span className="text-[10px] text-white/20 font-mono">Less</span>
                    {LEVELS.map((cls, i) => (
                        <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${cls}`} />
                    ))}
                    <span className="text-[10px] text-white/20 font-mono">More</span>
                </motion.div>
            </div>
        </div>
    );
}
