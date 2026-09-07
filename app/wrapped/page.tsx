"use client";

import {useState, useEffect, useCallback, useRef} from "react";
import {useRouter} from "next/navigation";
import {AnimatePresence, motion} from "motion/react";
import SlideRenderer from "@/components/SlideRenderer";
import {X, Pause, RotateCcw, Home, Share2, Twitter, Link, Check} from "lucide-react";
import type { WrappedConfig } from "@/types/wrapped";
import type { GitHubStats } from "@/types/github";

const SLIDE_DURATION = 5000;
const SWIPE_THRESHOLD = 50;

export default function WrappedPage() {
    const router = useRouter();
    const [data, setData] = useState<{ stats: GitHubStats; config: WrappedConfig } | null>(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [copied, setCopied] = useState(false);

    const progressRef = useRef<HTMLDivElement>(null);
    const startTimeRef = useRef<number>(0);
    const pausedTimeRef = useRef<number>(0);
    const pauseStartRef = useRef<number>(0);
    const animationFrameRef = useRef<number>(0);

    const pointerStartRef = useRef({x: 0, y: 0});
    const touchStartRef = useRef({x: 0, y: 0, time: 0});

    useEffect(() => {
        const stats = sessionStorage.getItem("wrappedStats");
        const config = sessionStorage.getItem("wrappedConfig");

        if (!stats || !config) {
            router.push("/");
            return;
        }
        try {
            const parsed = {
                stats: JSON.parse(stats),
                config: JSON.parse(config),
            };
            queueMicrotask(() => setData(parsed));
        } catch (e) {
            console.error(e);
            router.push("/");
        }
    }, [router]);

    // --- Navigation Logic ---

    const resetTimer = () => {
        startTimeRef.current = Date.now();
        pausedTimeRef.current = 0;
        pauseStartRef.current = 0;
        if (progressRef.current) {
            progressRef.current.style.width = "0%";
        }
    };

    const goToNext = useCallback(() => {
        if (!data) return;
        if (currentSlideIndex < data.config.slides.length - 1) {
            setCurrentSlideIndex((prev) => prev + 1);
            resetTimer();
        } else {
            setIsFinished(true);
        }
    }, [currentSlideIndex, data]);

    const goToPrev = useCallback(() => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex((prev) => prev - 1);
            resetTimer();
        }
    }, [currentSlideIndex]);

    const handleReplay = useCallback(() => {
        setIsFinished(false);
        setCurrentSlideIndex(0);
        resetTimer();
    }, []);

    // Auto-advance timer
    useEffect(() => {
        if (!data || isPaused || isFinished) return;

        const loop = () => {
            const now = Date.now();
            const elapsed = now - startTimeRef.current - pausedTimeRef.current;
            const progress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);

            if (progressRef.current) {
                progressRef.current.style.width = `${progress}%`;
            }

            if (elapsed >= SLIDE_DURATION) {
                goToNext();
            } else {
                animationFrameRef.current = requestAnimationFrame(loop);
            }
        };

        animationFrameRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [isPaused, currentSlideIndex, data, goToNext, isFinished]);

    // Tap navigation (desktop)
    const handlePointerDown = (e: React.PointerEvent) => {
        setIsPaused(true);
        pauseStartRef.current = Date.now();
        pointerStartRef.current = {x: e.clientX, y: e.clientY};
        cancelAnimationFrame(animationFrameRef.current);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsPaused(false);
        const pauseDuration = Date.now() - pauseStartRef.current;
        pausedTimeRef.current += pauseDuration;

        const diffX = Math.abs(e.clientX - pointerStartRef.current.x);
        const diffY = Math.abs(e.clientY - pointerStartRef.current.y);
        const isTap = diffX < 10 && diffY < 10;

        if (pauseDuration < 200 && isTap) {
            const screenWidth = window.innerWidth;
            if (e.clientX < screenWidth * 0.3) {
                goToPrev();
            } else {
                goToNext();
            }
        }
    };

    // Swipe navigation (mobile)
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        touchStartRef.current = {x: touch.clientX, y: touch.clientY, time: Date.now()};
        setIsPaused(true);
        pauseStartRef.current = Date.now();
        cancelAnimationFrame(animationFrameRef.current);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        setIsPaused(false);
        const pauseDuration = Date.now() - pauseStartRef.current;
        pausedTimeRef.current += pauseDuration;

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;
        const deltaTime = Date.now() - touchStartRef.current.time;

        // Only register as swipe if horizontal movement > threshold,
        // horizontal > vertical, and it was quick
        const isHorizontalSwipe =
            Math.abs(deltaX) > SWIPE_THRESHOLD &&
            Math.abs(deltaX) > Math.abs(deltaY) * 1.5 &&
            deltaTime < 500;

        if (isHorizontalSwipe) {
            if (deltaX < 0) {
                goToNext();
            } else {
                goToPrev();
            }
        }
    };

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") goToNext();
            if (e.key === "ArrowLeft") goToPrev();
            if (e.key === " ") {
                e.preventDefault();
                setIsPaused(true);
                pauseStartRef.current = Date.now();
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === " ") {
                setIsPaused(false);
                const pauseDuration = Date.now() - pauseStartRef.current;
                pausedTimeRef.current += pauseDuration;
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [goToNext, goToPrev]);

    if (!data) return null;

    // --- Finished Screen ---
    if (isFinished) {
        const shareText = `I made ${data.stats.totalCommits.toLocaleString()} contributions this year on GitHub! My rank: ${data.stats.rankTitle} ${data.stats.rankIcon}\n\nCheck out Git Wrapped:`;
        const shareUrl = typeof window !== "undefined" ? window.location.origin : "";

        const handleNativeShare = async () => {
            if (navigator.share) {
                try {
                    await navigator.share({ title: "Git Wrapped", text: shareText, url: shareUrl });
                } catch {}
            }
        };

        const handleCopyLink = async () => {
            try {
                await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch {}
        };

        const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

        return (
            <main className="fixed inset-0 bg-[#050505] overflow-hidden font-sans flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-8 px-6 max-w-lg"
                >
                    <div className="space-y-2">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm font-bold text-white/30 uppercase tracking-widest"
                        >
                            That&apos;s a wrap
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl md:text-6xl font-black text-white tracking-tighter"
                        >
                            @{data.stats.username || "developer"}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-lg text-white/40"
                        >
                            {data.stats.totalCommits.toLocaleString()} contributions this year
                        </motion.p>
                    </div>

                    {/* Stat highlights */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex justify-center gap-6 text-center"
                    >
                        <div>
                            <p className="text-2xl font-black text-white">{data.stats.longestStreak}</p>
                            <p className="text-xs text-white/30 uppercase">Day Streak</p>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div>
                            <p className="text-2xl font-black text-white">{data.stats.rankIcon}</p>
                            <p className="text-xs text-white/30 uppercase">{data.stats.rankTitle}</p>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div>
                            <p className="text-2xl font-black text-white">{data.stats.topLanguages?.[0] || "N/A"}</p>
                            <p className="text-xs text-white/30 uppercase">Top Lang</p>
                        </div>
                    </motion.div>

                    {/* Share buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="space-y-3"
                    >
                        <p className="text-xs text-white/20 uppercase tracking-widest">Share your wrapped</p>
                        <div className="flex justify-center gap-2">
                            {hasNativeShare && (
                                <button
                                    onClick={handleNativeShare}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/20 transition-colors border border-white/10"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </button>
                            )}
                            <button
                                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank")}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/20 transition-colors border border-white/10"
                            >
                                <Twitter className="w-4 h-4" />
                                Twitter
                            </button>
                            <button
                                onClick={handleCopyLink}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/20 transition-colors border border-white/10"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Link className="w-4 h-4" />}
                                {copied ? "Copied" : "Copy"}
                            </button>
                        </div>
                    </motion.div>

                    {/* Action buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="flex flex-col sm:flex-row gap-3 justify-center"
                    >
                        <button
                            onClick={handleReplay}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Play Again
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors border border-white/10"
                        >
                            <Home className="w-4 h-4" />
                            Home
                        </button>
                    </motion.div>
                </motion.div>
            </main>
        );
    }

    // --- Slideshow ---
    return (
        <main className="fixed inset-0 bg-black overflow-hidden font-sans select-none touch-none">

            {/* Progress bars */}
            <div className="absolute top-0 left-0 right-0 z-50 p-4 pt-6 flex gap-2 pointer-events-none">
                {data.config.slides.map((_, index) => (
                    <div key={index} className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                            ref={index === currentSlideIndex ? progressRef : null}
                            className="h-full bg-white"
                            style={{
                                width: index < currentSlideIndex ? "100%" : "0%",
                                transition: index !== currentSlideIndex ? "width 0.3s ease" : "none"
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Paused indicator + Close button */}
            <div className="absolute top-8 left-4 right-4 z-50 flex justify-between items-center pointer-events-none">
                <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 transition-all duration-300 ${isPaused ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
                    <Pause className="w-3 h-3 fill-white text-white"/>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Paused</span>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push("/");
                    }}
                    className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer pointer-events-auto"
                    aria-label="Close wrapped view"
                >
                    <X className="w-6 h-6"/>
                </button>
            </div>

            {/* Slide area */}
            <div
                className="relative z-0 w-full h-full flex items-center justify-center cursor-pointer"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onPointerLeave={() => {
                    setIsPaused(false);
                    const pauseDuration = Date.now() - pauseStartRef.current;
                    pausedTimeRef.current += pauseDuration;
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlideIndex}
                        className="w-full h-full"
                        initial={{opacity: 0, scale: 0.95, filter: "blur(10px)"}}
                        animate={{opacity: 1, scale: 1, filter: "blur(0px)"}}
                        exit={{opacity: 0, scale: 1.05, filter: "blur(10px)"}}
                        transition={{duration: 0.4, ease: [0.22, 1, 0.36, 1]}}
                    >
                        <SlideRenderer
                            slide={data.config.slides[currentSlideIndex]}
                            stats={data.stats}
                            onNext={goToNext}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </main>
    );
}
