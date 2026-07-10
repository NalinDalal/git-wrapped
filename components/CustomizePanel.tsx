"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import type { WrappedConfig, WrappedSlide } from "@/types/wrapped";

interface Props {
    stats: any;
    onGenerate: (config: WrappedConfig) => void;
}

// FIX: Added 'persona' and 'achievements' to this list
const ALL_SLIDES: { id: WrappedSlide; label: string }[] = [
    { id: "totalCommits", label: "Total Commits" },
    { id: "commitRank", label: "Rank" },
    { id: "topLanguages", label: "Top Languages" },
    { id: "longestStreak", label: "Best Streak" },
    { id: "persona", label: "Persona Identity" },
    { id: "achievements", label: "Achievements" },
    { id: "summary", label: "Summary Card" },
];

export default function CustomizePanel({ onGenerate }: Props) {
    // Default to selecting all slides
    const [slides, setSlides] = useState<WrappedSlide[]>(ALL_SLIDES.map(s => s.id));

    function toggleSlide(slide: WrappedSlide) {
        setSlides((prev) =>
            prev.includes(slide)
                ? prev.filter((s) => s !== slide)
                : [...prev, slide]
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                    Included Slides
                </label>
                <div className="grid gap-2">
                    {ALL_SLIDES.map((slide) => (
                        <div
                            key={slide.id}
                            onClick={() => toggleSlide(slide.id)}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                slides.includes(slide.id)
                                    ? "bg-white/10 border-white/20"
                                    : "bg-transparent border-transparent opacity-50 hover:opacity-100"
                            }`}
                        >
                            <Checkbox
                                checked={slides.includes(slide.id)}
                                onCheckedChange={() => toggleSlide(slide.id)}
                                className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-black"
                            />
                            <span className="font-medium">{slide.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Button
                className="w-full h-12 bg-linear-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-bold rounded-xl"
                onClick={() => onGenerate({ theme: "neon", slides })}
                disabled={slides.length === 0}
            >
                Generate Story
            </Button>
        </div>
    );
}