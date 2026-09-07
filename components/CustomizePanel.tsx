"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import type { WrappedConfig, WrappedSlide } from "@/types/wrapped";
import { defaultWrappedConfig } from "@/wrapped.config";

interface Props {
    onGenerate: (config: WrappedConfig) => void;
}

// All available slide types for the wrapped story
const ALL_SLIDES: { id: WrappedSlide; label: string }[] = [
    { id: "intro", label: "Introduction" },
    { id: "totalCommits", label: "Total Commits" },
    { id: "commitRank", label: "Rank" },
    { id: "topLanguages", label: "Top Languages" },
    { id: "mostActiveDay", label: "Most Active Day" },
    { id: "mostActiveMonth", label: "Most Active Month" },
    { id: "longestStreak", label: "Best Streak" },
    { id: "starsEarned", label: "Stars Earned" },
    { id: "persona", label: "Persona Identity" },
    { id: "achievements", label: "Achievements" },
    { id: "heatmap", label: "Contribution Heatmap" },
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
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleSlide(slide.id); }}
                            role="checkbox"
                            aria-checked={slides.includes(slide.id)}
                            tabIndex={0}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${slides.includes(slide.id)
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
                className="w-full h-12 bg-white text-black hover:bg-gray-200 font-bold rounded-xl"
                onClick={() => onGenerate({ ...defaultWrappedConfig, slides })}
                disabled={slides.length === 0}
            >
                Generate Story
            </Button>
        </div>
    );
}
