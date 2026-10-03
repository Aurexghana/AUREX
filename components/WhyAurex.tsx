"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, hoverLiftStrong } from "@/lib/motion";
import SectionBackgroundVector from "@/components/SectionBackgroundVector";

// Per Figma node 85:11775 - new section added between How it Works and
// Investment Packages, restating AUREX's core value pillars. The source
// design's own image tile is a small line-icon centered in a lot of empty
// dark space (see its own node - a 24-33px glyph in a ~192px-tall box),
// which read as an unfinished placeholder rather than a finished tile per
// request, so each pillar gets a real photo instead. The first set read as
// dated, so they were swapped for brighter, more current ones: a flowing
// gold 3D ribbon for Exclusivity (Mohammed Kara), a phone showing a
// "Secured" lock screen for Security (Dan Nelson), a sunlit glass facade
// for Transparency (Joel Filipe), and a 3D orange/blue bar chart for
// Growth (Nick Brunner). All from Unsplash (free license, no attribution
// required).
const PILLARS = [
  {
    title: "Exclusivity",
    description: "Access to off-market private equity and specialized funds.",
    image: "/brand/why-aurex-exclusivity.jpg",
  },
  {
    title: "Security",
    description: "Institutional-grade encryption and secure vault technology.",
    image: "/brand/why-aurex-security.jpg",
  },
  {
    title: "Transparency",
    description: "Real-time performance reporting and clear fee structures.",
    image: "/brand/why-aurex-transparency.jpg",
  },
  {
    title: "Growth",
    description:
      "Curated strategies designed for sophisticated capital appreciation.",
    image: "/brand/why-aurex-growth.jpg",
  },
];

export default function WhyAurex() {
  return (
    <section
      id="why-aurex"
      className="relative w-full overflow-hidden border border-grid-line px-6 py-16 sm:px-10 sm:py-20 md:px-16 md:py-24 lg:px-[100px]"
    >
      <SectionBackgroundVector variant="whyAurex" />
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col items-center gap-12 sm:gap-16"
      >
        <motion.h2
          variants={staggerItem}
          className="text-center font-jakarta text-2xl font-semibold tracking-tight text-cream sm:text-3xl lg:text-4xl"
        >
          Why Aurex
        </motion.h2>

        {/* 4-up in one row from lg, matching Figma - same tight-at-lg
            squeeze as HowItWorks.tsx (this section's own lg:px-[100px]
            stacks on top of <main>'s lg:px-20), so padding/gap/title size
            are trimmed at lg specifically and relax again at xl. */}
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-2 xl:gap-6">
          {PILLARS.map(({ title, description, image }) => (
            <motion.div
              key={title}
              variants={staggerItem}
              {...hoverLiftStrong}
              // Per Figma node 100:12429 (light mode): unlike the dark-only
              // ink-light surfaces elsewhere (the Hero vault, its stat
              // overlays), this section's cards are meant to actually flip
              // to a near-white translucent surface in light mode, so this
              // uses the theme-aware panel token (like every other content
              // card) instead - bg-ink-light/30 stayed muddy dark-gray in
              // light mode because that token deliberately never flips.
              className="flex flex-col gap-6 border border-gold/20 bg-panel/40 p-5 backdrop-blur-[20px] lg:p-4 xl:p-6"
            >
              <div className="flex flex-col items-start gap-2">
                <h3 className="break-words font-jakarta text-lg font-semibold text-cream xl:text-xl">
                  {title}
                </h3>
                <p className="break-words font-sans text-sm leading-5 text-cream-dim">
                  {description}
                </p>
              </div>

              {/* Real photo per pillar (see PILLARS' own comment on why,
                  and where each one came from) instead of the small
                  centered line-icon this tile used to hold. Photos are shown
                  in their own bright colors (only a faint bottom shade on
                  top) - the old gold-brown wash was removed since it
                  dulled them. */}
              <div className="relative h-40 overflow-hidden border border-gold/20 lg:h-32 xl:h-40">
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
