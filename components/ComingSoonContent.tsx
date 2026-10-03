"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { staggerContainer, staggerItem, hoverScale } from "@/lib/motion";
import BrandMark from "@/components/BrandMark";
import SectionBackgroundVector from "@/components/SectionBackgroundVector";
import { ArrowUpRightIcon } from "@/components/icons";

/**
 * The actual animated /coming-soon content - split out from
 * app/coming-soon/page.tsx for the same reason components/NotFoundContent.tsx
 * is split from app/not-found.tsx: that file needs to stay a Server
 * Component to export `metadata`, but this needs "use client" for the
 * motion/stagger entrance.
 *
 * This page is structurally a sibling of the 404 page (same centered-hero-
 * card shape, BrandMark, SectionBackgroundVector, gradient heading, "Back
 * to Home" pill) and previously rendered with zero entrance animation while
 * NotFoundContent got the full staggered treatment - this brings it in
 * line using the same shared variants, rather than inventing a new motion
 * pattern for it.
 */
export default function ComingSoonContent() {
  return (
    <section className="relative flex min-h-[60vh] w-full flex-col items-center justify-center gap-8 overflow-hidden px-6 py-16 text-center sm:py-24">
      <SectionBackgroundVector variant="comingSoon" />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex flex-col items-center gap-8"
      >
        <motion.div variants={staggerItem}>
          <BrandMark variant="large" />
        </motion.div>

        <motion.div variants={staggerItem} className="flex max-w-2xl flex-col items-center gap-4">
          <h1 className="font-jakarta text-4xl font-semibold tracking-tight text-cream sm:text-5xl md:text-6xl md:tracking-[-0.02em]">
            <span className="block">Coming</span>
            <span className="block bg-gradient-to-r from-gold-bright via-gold-deep via-50% to-gold-bright bg-clip-text text-transparent">
              Soon.
            </span>
          </h1>
          <p className="max-w-md font-jakarta text-base leading-7 text-cream-dim sm:text-lg">
            We&apos;re still building this part of AUREX. In the meantime,
            explore what&apos;s already live on the home page.
          </p>
        </motion.div>

        <motion.div variants={staggerItem}>
          <motion.div {...hoverScale}>
            <Link
              href="/"
              className="flex h-[52px] items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-8 font-jakarta text-base text-amainblack"
            >
              Back to Home
              <ArrowUpRightIcon className="size-[15px]" />
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
