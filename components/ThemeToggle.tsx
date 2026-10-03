"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme";
import { hoverScale, duration } from "@/lib/motion";

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="10" cy="10" r="4" fill="currentColor" />
      <path
        d="M10 0.833V3M10 17v2.167M2.05 2.05l1.534 1.534M16.416 16.416l1.534 1.534M0.833 10H3M17 10h2.167M2.05 17.95l1.534-1.534M16.416 3.584l1.534-1.534"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M17.5 11.892A8.334 8.334 0 1 1 8.108 2.5a6.667 6.667 0 0 0 9.392 9.392Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Manual light/dark toggle - independent of the OS-level prefers-color-
 * scheme (this site is dark by default regardless of system setting; the
 * toggle is the only way to reach the light theme from Figma node 37:2570).
 *
 * Rendered once, globally (see app/layout.tsx), as a fixed floating
 * control pinned to the bottom-right corner rather than living inside the
 * navbar - per request, so it stays reachable at a constant spot on
 * screen regardless of scroll position instead of scrolling away with the
 * rest of the header content.
 *
 * State is applied via a `data-theme` attribute on <html> (see lib/theme.ts
 * for the persistence + no-flash init script) and every color that needs
 * to change per theme is driven by CSS custom properties in globals.css,
 * not by this component - it only flips the switch. bg-ink/border-grid-
 * line/text-cream are all theme tokens, so this button re-colors itself
 * for free without any `light:` overrides of its own.
 *
 * Rendered on every page, including the /apply/* application flow - per
 * request, this control stays available everywhere rather than being
 * hidden on any particular route.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <motion.button
      {...hoverScale}
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      aria-pressed={isLight}
      className="fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center overflow-hidden border border-grid-line bg-ink/80 text-cream shadow-lg backdrop-blur-md transition-colors hover:text-gold-light"
    >
      {/* Icon crossfades on toggle instead of swapping instantly - a small,
          consistent micro-interaction like every other clickable control
          on the site, reusing the shared duration token rather than a new
          one-off transition value. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isLight ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 90 }}
          transition={{ duration: duration.fast, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          {isLight ? <MoonIcon className="size-5" /> : <SunIcon className="size-5" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
