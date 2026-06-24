import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Use motion values for smooth hardware-accelerated movement
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Apply spring configurations for a beautiful inertia feel
  const springConfig = { damping: 25, stiffness: 280, mass: 0.4 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only enable custom cursor on devices that support a mouse
    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Detect if cursor is hovering over an interactive element
      const isInteractive = 
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("input") ||
        target.closest(".cursor-pointer") ||
        target.closest('[role="button"]') ||
        target.closest("#click-zone-left") ||
        target.closest("#click-zone-right");

      setIsHovered(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  const [hasMouse, setHasMouse] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setHasMouse(mediaQuery.matches);
  }, []);

  if (!hasMouse || !isVisible) return null;

  return (
    <motion.div
      style={{
        left: cursorXSpring,
        top: cursorYSpring,
        x: "-50%",
        y: "-50%",
      }}
      className="fixed pointer-events-none z-[9999] select-none"
      animate={{
        scale: isHovered ? 1.3 : 1.0,
        rotate: isHovered ? 12 : 0,
      }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-[52px] h-[52px] drop-shadow-[0_3px_10px_rgba(3,105,161,0.35)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft shadow layer */}
        <path
          d="M 50,8 C 53,23 58,32 62,34 C 75,34 85,32 92,38 C 82,45 74,50 70,58 C 73,72 78,82 75,88 C 65,83 58,75 50,75 C 42,75 35,83 25,88 C 22,82 27,72 30,58 C 26,50 18,45 8,38 C 15,32 25,34 38,34 C 42,32 47,23 50,8 Z"
          fill="#38bdf8"
          opacity="0.2"
          transform="translate(1, 2)"
        />
        {/* Main starfish body (light blue matching uploaded image) */}
        <path
          d="M 50,8 C 53,23 58,32 62,34 C 75,34 85,32 92,38 C 82,45 74,50 70,58 C 73,72 78,82 75,88 C 65,83 58,75 50,75 C 42,75 35,83 25,88 C 22,82 27,72 30,58 C 26,50 18,45 8,38 C 15,32 25,34 38,34 C 42,32 47,23 50,8 Z"
          fill="#e0f2fe"
          stroke="#5b89a1"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        
        {/* Starfish central design */}
        <circle cx="50" cy="50" r="5.5" fill="#7dd3fc" opacity="0.6" />
        
        {/* Granular white starfish bumps / skeleton pattern */}
        <circle cx="50" cy="50" r="1.8" fill="#ffffff" />
        <circle cx="44" cy="45" r="1.3" fill="#ffffff" />
        <circle cx="56" cy="45" r="1.3" fill="#ffffff" />
        <circle cx="54" cy="55" r="1.3" fill="#ffffff" />
        <circle cx="46" cy="55" r="1.3" fill="#ffffff" />
        
        {/* Top arm beads */}
        <circle cx="50" cy="38" r="1.5" fill="#bae6fd" />
        <circle cx="50" cy="30" r="1.4" fill="#ffffff" />
        <circle cx="50" cy="22" r="1.2" fill="#ffffff" />
        <circle cx="50" cy="14" r="1.0" fill="#ffffff" />
        
        {/* Right arm beads */}
        <circle cx="59" cy="41" r="1.5" fill="#bae6fd" />
        <circle cx="68" cy="39" r="1.4" fill="#ffffff" />
        <circle cx="77" cy="38" r="1.2" fill="#ffffff" />
        <circle cx="85" cy="38" r="1.0" fill="#ffffff" />
        
        {/* Bottom Right arm beads */}
        <circle cx="56" cy="56" r="1.5" fill="#bae6fd" />
        <circle cx="62" cy="65" r="1.4" fill="#ffffff" />
        <circle cx="67" cy="73" r="1.2" fill="#ffffff" />
        <circle cx="71" cy="80" r="1.0" fill="#ffffff" />
        
        {/* Bottom Left arm beads */}
        <circle cx="44" cy="56" r="1.5" fill="#bae6fd" />
        <circle cx="38" cy="65" r="1.4" fill="#ffffff" />
        <circle cx="33" cy="73" r="1.2" fill="#ffffff" />
        <circle cx="29" cy="80" r="1.0" fill="#ffffff" />
        
        {/* Left arm beads */}
        <circle cx="41" cy="41" r="1.5" fill="#bae6fd" />
        <circle cx="32" cy="39" r="1.4" fill="#ffffff" />
        <circle cx="23" cy="38" r="1.2" fill="#ffffff" />
        <circle cx="15" cy="38" r="1.0" fill="#ffffff" />
      </svg>
    </motion.div>
  );
}