"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";

/**
 * Shared full-bleed title banner for standalone pages below the home page
 * (currently /how-it-works and /contact) - generalized from the original
 * /how-it-works-only banner (Figma node 110:13581) so a second page could
 * reuse the exact same background treatment instead of a copy-pasted file.
 *
 * The background is NOT the "Looper BG" thin-line swirl used behind the
 * home hero (an earlier pass here wrongly assumed it was, since a same-
 * named/rotated asset also happens to sit at the page root in Figma) -
 * inspecting the /how-it-works banner node in isolation showed a
 * completely different background: a wavy monochrome sheen
 * (how-it-works-banner-wave.png, mix-blend-overlay) plus a tiny dot-grid
 * tile (how-it-works-banner-dots.png, repeated every 32px at 60% opacity)
 * with a gold tint layer (mix-blend-color) over both. Both PNGs are
 * downloaded/committed from the Figma file rather than referenced by their
 * temporary export URLs (which expire after ~7 days). Reused as-is for
 * /contact (no separate Figma banner design exists for it) so every
 * standalone page shares one consistent "title band" look rather than
 * inventing a new background per page.
 *
 * Per request, light mode gets its own dedicated look here - a solid,
 * vivid warm-gold band (reference: a gold banner with a diagonal light
 * sheen and a faint dot-grid running through it) - rather than the normal
 * auto-flipping page background (dark ink -> near-white) the rest of the
 * site uses. Two earlier attempts at this both missed the reference:
 *   1. A near-white base with the same overlays at very low opacity read
 *      as barely-there off-white, not gold at all.
 *   2. Reusing dark mode's exact recipe (near-black base + this same wave
 *      PNG at `mix-blend-overlay`, tinted gold via `mix-blend-color`) is
 *      what dark mode itself renders as - but that turned out to be a
 *      mostly-black band with a thin gold streak, not the solid golden
 *      look in the reference either (confirmed by screenshotting both).
 * `mix-blend-overlay`'s math is why #2 fails: for the wave PNG's darkest
 * pixels (~7% gray, not literally 0 but close), overlay's shadow formula
 * is `2 * base * overlay`, i.e. ~14% of the base color - crushed almost
 * to black regardless of how gold the base is.
 *
 * So light mode instead gets: a genuine gold gradient as the base (dark
 * amber top-right fading to bright gold bottom-left, tracking the wave
 * photo's own dark-corner/bright-streak layout); the wave photo applied
 * with `mix-blend-screen` instead of `overlay` (screen only ever
 * lightens - `1 - (1-base)(1-overlay)` - so the photo's dark corner
 * leaves the gold base untouched instead of crushing it toward black,
 * while its bright streaks still lighten through as a highlight sheen);
 * and the same gold `mix-blend-color` tint layer from dark mode kept on
 * top, which re-tints screen's lightened streaks back toward gold hue
 * (screen alone would push bright spots toward washed-out white) so nothing
 * in the sheen reads as plain white, matching the reference's all-gold
 * tonal range. The dot-grid tile is unchanged (still light-colored dots,
 * just at lower opacity - they're a much smaller texture on a mid-tone
 * gold base than the near-black one they were tuned for).
 *
 * Title/description text colors are pinned to an explicit hex per theme
 * rather than routed through `text-cream` (which already flips dark in
 * light mode, but to the wrong dark - it targets ink-black text on a
 * near-white page, not this banner's own gold backdrop): dark mode keeps
 * the light/cream text this banner always had, while light mode uses the
 * same near-black ink color per request, which reads fine here since the
 * gold gradient is bright enough for dark text to contrast against.
 *
 * The background stack below deliberately has NO negative z-index: since
 * a plain `relative` element (no z-index of its own) doesn't establish
 * its own stacking context, a `-z-10` child here would actually be
 * compared against the page root's stacking context instead of just this
 * section - meaning the section's own background could paint after (i.e.
 * on top of) it. Leaving these children at the default z-index and
 * relying on DOM order (image stack first, text content after) keeps
 * everything correctly layered within this section alone, same as
 * AboutVisualPanel's background stack.
 */
export default function PageBanner({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden border border-grid-line bg-ink light:bg-gradient-to-bl light:from-[#8a5f1e] light:via-[#cf9f45] light:to-[#f0cf7e] px-6 py-16 text-center sm:gap-8 sm:px-10 sm:py-20 md:px-16 lg:px-[100px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/how-it-works-banner-wave.png"
          alt=""
          className="absolute inset-0 size-full object-cover mix-blend-overlay light:mix-blend-screen light:opacity-60"
        />
        <div
          className="absolute inset-0 bg-left-top opacity-60 light:opacity-20"
          style={{ backgroundImage: "url(/brand/how-it-works-banner-dots.png)", backgroundSize: "32px 32px" }}
        />
        <div className="absolute inset-0 bg-gold-light mix-blend-color light:opacity-70" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative flex max-w-3xl flex-col items-center gap-4 sm:gap-6"
      >
        <motion.h1
          variants={staggerItem}
          className="font-barlow text-4xl font-semibold tracking-tight text-[#eae1d4] light:text-[#1a1a1a] sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>
        <motion.p
          variants={staggerItem}
          className="max-w-2xl font-barlow text-base leading-7 text-neutral-200 light:text-[#1a1a1a] sm:text-lg"
        >
          {description}
        </motion.p>
      </motion.div>
    </section>
  );
}
