"use client";
import { motion } from "motion/react";

const languagesColors: Record<string, string> = {
    TypeScript: "#3178c6", JavaScript: "#f7df1e", Python: "#3776ab",
    Go: "#00add8", Rust: "#dea584", HTML: "#e34c26", CSS: "#563d7c", default: "#888888"
};

export default function TopLanguages({ stats }: any) {
    const languages = stats.topLanguages || [];

    return (
        <div className="w-full h-full flex flex-col justify-center p-8 bg-[#0D1117] relative font-mono">
            {/* Background Line Numbers */}
            <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-center gap-8 text-zinc-800 text-sm select-none pointer-events-none">
                {[...Array(20)].map((_,i) => <span key={i}>{i+1}</span>)}
            </div>

            <motion.div
                className="relative z-10 max-w-xl mx-auto w-full pl-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="mb-12">
                    <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-green-400 text-sm mb-2"
                    >
                        // Your stack defined you
                    </motion.p>
                    <h2 className="text-4xl font-bold text-white">
                        const <span className="text-blue-400">stack</span> = [
                    </h2>
                </div>

                <div className="space-y-6">
                    {languages.map((lang: string, index: number) => (
                        <div key={lang} className="relative">
                            <div className="flex items-center gap-4 mb-2">
                                <span className="text-zinc-600">"{lang}"</span>,
                            </div>
                            {/* Animated Bar */}
                            <div className="h-12 w-full bg-white/5 rounded-lg overflow-hidden relative group border border-white/5 hover:border-white/20 transition-colors">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${100 - (index * 25)}%` }} // Mock percentage
                                    transition={{ delay: 0.5 + (index * 0.2), duration: 1, ease: "circOut" }}
                                    className="h-full absolute top-0 left-0 opacity-80"
                                    style={{ backgroundColor: languagesColors[lang] || languagesColors.default }}
                                />
                                <div className="absolute inset-0 flex items-center px-4 font-bold text-white mix-blend-difference">
                                    {lang}
                                </div>
                            </div>
                        </div>
                    ))}
                    <h2 className="text-4xl font-bold text-white mt-8">];</h2>
                </div>
            </motion.div>
        </div>
    );
}