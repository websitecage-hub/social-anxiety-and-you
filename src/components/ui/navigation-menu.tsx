"use client";

import * as React from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "Problem", href: "#problem" },
  { name: "Chapters", href: "#chapters" },
  { name: "Order", href: "#cta" },
];

const EXPAND_SCROLL_THRESHOLD = 80;

const containerVariants = {
  expanded: {
    y: 0,
    opacity: 1,
    width: "auto",
    transition: {
      y: { type: "spring", damping: 20, stiffness: 200 },
      opacity: { duration: 0.3 },
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  collapsed: {
    y: 0,
    opacity: 1,
    width: "3.2rem",
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 250,
      when: "afterChildren",
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

const logoVariants = {
  expanded: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -15, scale: 0.8, transition: { duration: 0.2 } },
};

const itemVariants = {
  expanded: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -10, scale: 0.9, transition: { duration: 0.15 } },
};

const collapsedIconVariants = {
  expanded: { opacity: 0, scale: 0.5, y: 10, transition: { duration: 0.2 } },
  collapsed: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 200,
      delay: 0.1,
    }
  },
};

export function AnimatedNavFramer() {
  const [isExpanded, setExpanded] = React.useState(true);

  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;

    if (isExpanded && latest > previous && latest > 120) {
      setExpanded(false);
      scrollPositionOnCollapse.current = latest;
    }
    else if (!isExpanded && latest < previous && (scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD)) {
      setExpanded(true);
    }

    lastScrollY.current = latest;
  });

  const handleNavClick = (e: React.MouseEvent) => {
    if (!isExpanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  return (
    <nav className="fixed top-6 md:top-8 left-0 right-0 z-[100] flex justify-center px-4 md:px-0" role="navigation" aria-label="Main navigation">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={containerVariants}
        whileHover={!isExpanded ? { scale: 1.05 } : {}}
        whileTap={!isExpanded ? { scale: 0.95 } : {}}
        onClick={handleNavClick}
        className={cn(
          "flex items-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--bg-deep)]/95 backdrop-blur-2xl h-12 px-2 md:px-3 relative max-w-full",
          "shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] border-white/10",
          !isExpanded && "cursor-pointer justify-center px-0 bg-gradient-to-br from-[var(--bg-deep)] via-[var(--bg-elevated)] to-[var(--accent-dim)] border-[var(--accent-dim)]/20"
        )}
      >
        <motion.div
          variants={logoVariants}
          className="flex-shrink-0 flex items-center pr-2 md:pr-3 border-r border-[var(--border)]"
        >
          <img src="/logo.jpg" alt="SA&Y" className="h-5 w-5 md:h-6 md:w-6 rounded-sm ml-1 md:mr-2 opacity-80" />
          <span className="text-[var(--fg-primary)] text-[10px] md:text-[11px] tracking-tighter hidden xs:inline font-bold ml-1">SA&Y</span>
        </motion.div>

        <motion.div
          className={cn(
            "flex items-center gap-0.5 sm:gap-4 pl-1 md:pl-3",
            !isExpanded && "pointer-events-none"
          )}
        >
          {navItems.map((item) => (
            <motion.a
              key={item.name}
              href={item.href}
              variants={itemVariants}
              onClick={(e) => e.stopPropagation()}
              className="text-[9px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] font-bold text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors duration-200 px-1.5 md:px-2 py-1 cursor-pointer whitespace-nowrap"
            >
              {item.name}
            </motion.a>
          ))}
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <motion.div
            variants={collapsedIconVariants}
            animate={isExpanded ? "expanded" : "collapsed"}
            className="flex items-center justify-center"
          >
            <Menu className="h-5 w-5 text-[var(--accent)]" />
          </motion.div>
        </div>
      </motion.div>
    </nav>
  );
}
