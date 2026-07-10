"use client";

import {useState, useEffect, useCallback, useRef} from "react";
import {useRouter} from "next/navigation";
import {AnimatePresence, motion} from "motion/react";
import SlideRenderer from "@/components/SlideRenderer";
import {X, Pause} from "lucide-react";

const SLIDE_DURATION = 5000;
export default function WrappedPage() {
    const router = useRouter();
    const [data, setData] = useState<{ stats: any; config: any } | null>(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const progressRef = useRef<HTMLDivElement>(null);
    const startTimeRef = useRef<number>(0);
    const pausedTimeRef = useRef<number>(0);
    const pauseStartRef = useRef<number>(0);
    const animationFrameRef = useRef<number>(0);

    const pointerStartRef = useRef({x: 0, y: 0});

    const fetchStats = async () => {
        const stats = sessionStorage.getItem("wrappedStats");
        const config = sessionStorage.getItem("wrappedConfig");

        if (!stats || !config) {
            router.push("/");
            return;
        }
        try {
            setData({
                stats: JSON.parse(stats),
                config: JSON.parse(config),
            });
        } catch (e) {
            console.error(e);
            router.push("/");
        }
    }

    useEffect(() => {
        (async () => {
            await fetchStats();
        })()

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
            console.log("Story Finished");
            router.push("/");
        }
    }, [currentSlideIndex, data, router]);

    const goToPrev = useCallback(() => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex((prev) => prev - 1);
            resetTimer();
        }
    }, [currentSlideIndex]);


    useEffect(() => {
        if (!data || isPaused) return;

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
    }, [isPaused, currentSlideIndex, data, goToNext]);


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

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") goToNext();
            if (e.key === "ArrowLeft") goToPrev();
            if (e.key === " ") setIsPaused(true);
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === " ") setIsPaused(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [goToNext, goToPrev]);

    if (!data) return null;

    return (
        <main
            className="fixed inset-0 bg-black overflow-hidden font-sans select-none touch-none"
            onContextMenu={(e) => e.preventDefault()}
        >

            <div className="absolute top-0 left-0 right-0 z-50 p-4 pt-6 flex gap-2 pointer-events-none">
                {data.config.slides.map((slide: string, index: number) => (
                    <div key={index} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                        <div
                            ref={index === currentSlideIndex ? progressRef : null}
                            className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                            style={{
                                width: index < currentSlideIndex ? "100%" : "0%",
                                transition: index !== currentSlideIndex ? "width 0.3s ease" : "none"
                            }}
                        />
                    </div>
                ))}
            </div>

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
                >
                    <X className="w-6 h-6"/>
                </button>
            </div>

            <div
                className="relative z-0 w-full h-full flex items-center justify-center cursor-pointer"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                <div
                    className="absolute inset-y-0 left-0 w-[30%] opacity-0 hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-white/5 to-transparent pointer-events-none hidden md:block"/>

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
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </main>
    );
}