"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { routeTransition } from "@/lib/motion";

/**
 * Route-level transition, wrapping every page's rendered output (see
 * app/layout.tsx). Nothing previously animated route changes at all -
 * navigating between pages swapped instantly, unlike every in-page section
 * (which fades/slides in via scrollReveal/staggerContainer).
 *
 * Deliberately NOT wrapped in <AnimatePresence>: an earlier version used
 * `<AnimatePresence mode="wait">` keyed on pathname so the outgoing page
 * could play an exit fade before the next one mounted. That's a
 * well-documented source of exactly one bug - the exit phase getting
 * stuck and leaving a blank page until a manual refresh - with
 * framer-motion + the Next.js App Router, and a real user hit it here
 * (clicking "Exit" on the investor application). It couldn't be
 * reproduced under automation (fast clicks, throttled network, reduced
 * motion, a production build, mid-flow state all came back clean), which
 * means there's no confident fix for the specific trigger - only for the
 * mechanism. So instead of patching around one reproduction of it, this
 * removes the "wait for the old page's exit before mounting the new one"
 * behavior entirely.
 *
 * What's left is an enter-only fade: React swaps the old keyed element for
 * the new one immediately (ordinary unmount, nothing deferred or blocked
 * on an animation callback), and the new page just fades in via
 * `routeTransition`. Less precious than a true crossfade, but it can't get
 * stuck - there's nothing left to hang.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    // flex flex-1 flex-col so this wrapper carries forward the sticky-
    // footer layout chain (body's own min-h-full flex flex-col -> this ->
    // each page's <main className="flex-1">...</main> -> Footer) instead
    // of collapsing to its own content height and silently breaking that
    // chain by introducing an extra, non-flex level in between.
    <motion.div key={pathname} variants={routeTransition} initial="initial" animate="animate" className="flex flex-1 flex-col">
      {children}
    </motion.div>
  );
}
