import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import { PortfolioPage } from "../types";
import { playPageTurnSound } from "../utils/sound";
import { ChevronLeft, ChevronRight, BookOpen, Sparkles } from "lucide-react";
// @ts-ignore
import leftArrow from "../assets/images/left.png";
// @ts-ignore
import rightArrow from "../assets/images/right.png";

interface PageTurnerProps {
  pages: PortfolioPage[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const PageTurner: React.FC<PageTurnerProps> = ({ pages, currentIndex, setCurrentIndex }) => {
  const [direction, setDirection] = useState<"forward" | "backward" | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for realistic 3D cursor tilt effect
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Spring animations for ultra-smooth tilting
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  // Handle Mouse Hover Parallax Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isFlipping) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate cursor position relative to the center of the book card (range: -0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;
    
    // Convert to rotation angles (tilt up to 10 degrees on hover)
    rotateY.set(mouseX * 12);
    rotateX.set(-mouseY * 12);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  // Turn to the next page (Right Click Zone)
  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isFlipping || currentIndex >= pages.length - 1) return;

    setIsFlipping(true);
    setDirection("forward");
    playPageTurnSound();
    
    // Smooth timing for 3D flip animation
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipping(false);
    }, 450);
  };

  // Turn to the previous page (Left Click Zone)
  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isFlipping || currentIndex <= 0) return;

    setIsFlipping(true);
    setDirection("backward");
    playPageTurnSound();

    setTimeout(() => {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipping(false);
    }, 450);
  };

  // Keyboard Navigation Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isFlipping]);

  const currentPage = pages[currentIndex];

  return (
    <div className="w-full max-w-5xl aspect-video flex flex-col items-center justify-center relative select-none">
      
      {/* 3D Perspective Book Wrapper */}
      <motion.div
        id="portfolio-book-container"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full relative cursor-pointer group"
        style={{
          perspective: 1600,
          rotateX: smoothRotateX,
          rotateY: smoothRotateY,
          transformStyle: "preserve-3d"
        }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Book shadow effect and page depth simulation */}
        <div className="absolute inset-0 bg-black/10 rounded-3xl blur-xl translate-y-4 translate-x-2 pointer-events-none transition-transform group-hover:translate-y-6 group-hover:blur-2xl z-0"></div>

        {/* 3D Book Thickness Layers Stack (Simulates multiple sheets stacked behind) */}
        <div className="absolute inset-1 bg-white/70 rounded-2xl border border-slate-200/50 translate-y-[3px] translate-x-[1px] rotate-[0.3deg] pointer-events-none z-1"></div>
        <div className="absolute inset-2 bg-white/50 rounded-2xl border border-slate-200/30 translate-y-[6px] translate-x-[2px] rotate-[0.6deg] pointer-events-none z-2"></div>
        <div className="absolute inset-3 bg-white/30 rounded-2xl border border-slate-200/20 translate-y-[9px] translate-x-[3px] rotate-[0.9deg] pointer-events-none z-3"></div>

        {/* Left & Right Interactive Clicking Zones */}
        <div className="absolute inset-0 w-full h-full rounded-3xl flex z-30 pointer-events-none">
          {/* Previous Page trigger overlay (left 50%) */}
          <div 
            id="click-zone-left"
            className="w-1/2 h-full relative pointer-events-auto flex items-center justify-start cursor-w-resize"
            onClick={handlePrev}
            title="点击上翻一页"
          >
            {currentIndex > 0 && (
              <img 
                src={leftArrow} 
                alt="Previous Page" 
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[76px] h-[76px] object-contain opacity-0 group-hover:opacity-85 hover:!opacity-100 hover:scale-115 active:scale-90 transition-all duration-300 pointer-events-auto mix-blend-multiply select-none"
                referrerPolicy="no-referrer"
              />
            )}
          </div>

          {/* Next Page trigger overlay (right 50%) */}
          <div 
            id="click-zone-right"
            className="w-1/2 h-full relative pointer-events-auto flex items-center justify-end cursor-e-resize"
            onClick={handleNext}
            title="点击下翻一页"
          >
            {currentIndex < pages.length - 1 && (
              <img 
                src={rightArrow} 
                alt="Next Page" 
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[76px] h-[76px] object-contain opacity-0 group-hover:opacity-85 hover:!opacity-100 hover:scale-115 active:scale-90 transition-all duration-300 pointer-events-auto mix-blend-multiply select-none"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        </div>

        {/* Content Page Container */}
        <div className="w-full h-full relative rounded-3xl overflow-hidden z-10 select-none">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              className="w-full h-full relative"
              initial={{
                rotateY: direction === "forward" ? 85 : -85,
                opacity: 0.3,
                scale: 0.96
              }}
              animate={{
                rotateY: 0,
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 0.45,
                  ease: [0.25, 1, 0.5, 1] // Custom snappy spring cubic bezier
                }
              }}
              exit={{
                rotateY: direction === "forward" ? -85 : 85,
                opacity: 0.3,
                scale: 0.96,
                transition: {
                  duration: 0.45,
                  ease: [0.25, 1, 0.5, 1]
                }
              }}
              style={{
                transformOrigin: direction === "forward" ? "left center" : "right center",
                backfaceVisibility: "hidden"
              }}
            >
              {currentPage.render()}
            </motion.div>
          </AnimatePresence>
        </div>

      </motion.div>



    </div>
  );
};
