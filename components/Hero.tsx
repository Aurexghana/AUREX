"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem, hoverScale } from "@/lib/motion";
import { ArrowUpRightIcon } from "@/components/icons";
import HeroLooperVector from "@/components/HeroLooperVector";

export default function Hero() {
  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="relative flex min-h-[60vh] w-full flex-col items-center justify-center gap-12 overflow-hidden sm:gap-16"
    >
      <HeroLooperVector />

      <div className="relative flex max-w-4xl flex-col items-center gap-6 text-center">
        <motion.h1
          variants={staggerItem}
          className="font-jakarta text-4xl font-semibold tracking-tight text-cream sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[1.1] lg:tracking-[-0.04em]"
        >
          <span className="block">Invest with purpose.</span>
          <span className="block bg-gradient-to-r from-gold-bright via-gold-deep via-50% to-gold-bright bg-clip-text text-transparent">
            Grow with confidence.
          </span>
        </motion.h1>

        <motion.p
          variants={staggerItem}
          className="max-w-2xl font-jakarta text-base leading-7 text-cream-dim sm:text-lg md:text-xl md:leading-8"
        >
          Aurex is an exclusive private investment platform designed for
          sophisticated investors seeking transparency and strategic growth.
        </motion.p>

        <motion.div
          variants={staggerItem}
          className="flex w-full flex-col items-center gap-4 pt-2 sm:w-auto sm:flex-row sm:gap-6"
        >
          {/* Both buttons are shorter, smaller-type, and auto (not full)
              width on mobile - full desktop scale kicks back in from sm. */}
          <motion.a
            {...hoverScale}
            href="/apply/investor"
            className="flex h-12 w-auto items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-5 font-jakarta text-base text-amainblack sm:h-[58px] sm:px-6 sm:text-lg"
          >
            Become an Investor
            <ArrowUpRightIcon className="size-[15px] sm:size-[17px]" />
          </motion.a>
          {/* This one's a page-level CTA, not part of the persistently-dark
              surfaces elsewhere in this section, so unlike those, it does
              flip in light mode - matching Figma's light variant (a
              white/50 blurred pill with dark text) rather than the
              token's usual "stay dark" behavior. */}
          <motion.a
            {...hoverScale}
            href="/how-it-works"
            className="flex h-12 w-auto items-center justify-center border border-gold-muted/30 bg-ink-light/50 px-6 font-sans text-sm font-medium text-neutral-200 backdrop-blur-md light:border-gold/30 light:bg-white/50 light:text-[#1a1a1a] sm:h-[58px] sm:px-8 sm:text-base"
          >
            Explore AUREX
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
}
