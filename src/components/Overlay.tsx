"use client";

import { useScroll, useTransform, motion } from "framer-motion";

export default function Overlay({ scrollYProgress }: { scrollYProgress: any }) {
  const HERO_CONTENT = {
    name: "Nikhil Salunke",
    role: "AI Architect/Dev | Problem Solver | Thinker  ",
    slide2TitleLine1: "Building production-grade ",
    slide2Highlight: "AI systems",
    slide2TitleLine2: "with measurable outcomes.",
    slide3TitleLine1: "Expertise in",
    slide3Highlight: "RAG, Agentic AI, LLM Optimization, ",
    slide3TitleLine2: "and AI Product Engineering.",
  };

  // Opacity transforms
  const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.5], [0, 1, 1, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.5, 0.6, 0.7, 0.8], [0, 1, 1, 0]);

  // Parallax Y movement (optional polish)
  const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0.2, 0.5], [50, -50]);
  const y3 = useTransform(scrollYProgress, [0.5, 0.8], [50, -50]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-center text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/45" />
        {/* Section 1 */}
        <motion.div 
            style={{ opacity: opacity1, y: y1 }}
            className="absolute inset-0 flex items-center justify-center p-8 will-change-transform"
        >
            <div className="text-center">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-4">
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
                    {HERO_CONTENT.name}
                  </span>
                </h1>
                <p className="text-xl md:text-2xl font-medium text-gray-200">
                  {HERO_CONTENT.role}
                </p>
            </div>
        </motion.div>

        {/* Section 2 */}
        <motion.div 
            style={{ opacity: opacity2, y: y2 }}
            className="absolute inset-0 flex items-center justify-start p-8 md:p-24 will-change-transform"
        >
            <div className="max-w-2xl">
                <h2 className="text-5xl md:text-7xl font-bold leading-tight text-gray-100">
                  {HERO_CONTENT.slide2TitleLine1}
                  <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
                    {HERO_CONTENT.slide2Highlight}
                  </span>{" "}
                  {HERO_CONTENT.slide2TitleLine2}
                </h2>
            </div>
        </motion.div>

        {/* Section 3 */}
        <motion.div 
            style={{ opacity: opacity3, y: y3 }}
            className="absolute inset-0 flex items-center justify-end p-8 md:p-24 text-right will-change-transform"
        >
            <div className="max-w-2xl">
                <h2 className="text-5xl md:text-7xl font-bold leading-tight text-gray-100">
                  {HERO_CONTENT.slide3TitleLine1}
                  <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
                    {HERO_CONTENT.slide3Highlight}
                  </span>{" "}
                  {HERO_CONTENT.slide3TitleLine2}
                </h2>
            </div>
        </motion.div>
    </div>
  );
}
