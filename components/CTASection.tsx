"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { scrollReveal, hoverScale } from "@/lib/motion";
import BrandMark from "@/components/BrandMark";
import JoinAurexModal from "@/components/JoinAurexModal";

export default function CTASection() {
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  return (
    // JoinAurexModal is rendered as a sibling of <section>, not nested
    // inside it - same reasoning as Navbar.tsx's own copy of this modal:
    // the section's inner pill has `backdrop-blur-md`, and nesting the
    // modal inside an ancestor with a `backdrop-filter` would resolve its
    // `fixed inset-0` against that ancestor's box instead of the viewport.
    <>
      <section className="w-full border border-grid-line p-6 sm:p-10 md:p-[60px]">
        <motion.div {...scrollReveal} className="flex flex-col gap-8 sm:gap-10">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
            <BrandMark variant="footer" />
            <div className="flex flex-1 flex-col gap-3 text-neutral-400 light:text-[#1a1a1a]">
              <p className="font-jakarta text-xl font-semibold sm:text-2xl">
                Today, AUREX Continues to Redefine the Future of Private
                Investment.
              </p>
              <p className="font-sans text-sm leading-relaxed sm:text-base">
                Combining strategic investment opportunities, transparency, and
                expert insight to create a smarter approach to wealth growth.
                Discover AUREX and explore a more confident way to invest.
              </p>
            </div>
          </div>

          {/* Stays stacked (info block on top, "Join Aurex" below) through
              tablet widths - only goes side-by-side from lg. At sm/md the
              "Welcome to Aurex" label + pill text plus the button don't have
              room to sit in a row without crowding, so the row layout is
              pushed to lg instead of the site's usual sm. */}
          <div className="flex flex-col gap-5 border border-grid-line bg-ink-light/20 p-6 backdrop-blur-md sm:gap-5 sm:p-[30px] lg:flex-row lg:items-center">
            <div className="flex flex-1 flex-col items-start gap-3.5 sm:flex-row sm:items-center">
              <p className="whitespace-nowrap font-sans text-lg font-semibold text-neutral-400 light:text-[#1a1a1a]">Welcome to Aurex</p>
              {/* Per Figma nodes 37:2203 (dark) / 284:2404 (light): this is
                  its own filled pill, not plain text sharing the outer
                  container's surface - bg-amainblack/text-white in dark
                  mode, bg-white/text-amainblack in light mode (amainblack
                  is one of the tokens that never flips between themes -
                  see globals.css - so it's the correct "near-black" for
                  both the dark pill's own background and the light pill's
                  own text). A prior pass had removed this fill entirely; restored
                  here to match both reference nodes, at every breakpoint
                  rather than just sm+ - the source design doesn't show a
                  "no pill on mobile" variant, so responsive padding (not
                  dropping the fill) is what actually keeps it tidy on
                  narrow screens. */}
              <p className="bg-amainblack px-3 py-2 font-sans text-sm leading-relaxed text-white light:bg-white light:text-amainblack sm:px-3.5 sm:py-2.5 sm:text-base">
                Where Strategic Investment, Transparency, and Expertise
                Intersect to Shape the Future of Private Wealth.
              </p>
            </div>
            {/* Was a plain "Start Project" link to /coming-soon - changed
                to open the same JoinAurexModal the navbar's own "Join
                Aurex" button opens (investor vs. business owner), rather
                than a second, different destination for what's really the
                same action. */}
            <motion.button
              {...hoverScale}
              type="button"
              onClick={() => setJoinModalOpen(true)}
              className="flex shrink-0 items-center justify-center bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-4 py-3 font-jakarta text-xs text-amainblack sm:px-5 sm:py-3.5 sm:text-sm"
            >
              Join Aurex
            </motion.button>
          </div>
        </motion.div>
      </section>

      <JoinAurexModal isOpen={joinModalOpen} onClose={() => setJoinModalOpen(false)} />
    </>
  );
}
