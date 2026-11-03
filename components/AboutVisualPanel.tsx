"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { easing } from "@/lib/motion";

/**
 * The "grid card" visual beside the About section's heading: the AUREX logo
 * centered on the photo/glass card. It used to cycle through proof-point
 * stats (Global AUM, Verified Members, Performance Yield); those were
 * removed because those figures will be served from a CRM instead of being
 * hardcoded here. The background layers keep their slow continuous
 * breathing animation. Transform-based motion is neutralized for
 * reduced-motion users by the root layout's <MotionConfig
 * reducedMotion="user">.
 */
export default function AboutVisualPanel() {
  return (
    <div
      // Deliberately a hardcoded dark border, not the auto-flipping
      // border-grid-line token: this panel keeps its dark photo/glass
      // treatment in light mode too (matching Figma, which keeps this
      // exact node at border-[#262626] in both themes), unlike the plain
      // section dividers around it that do turn light-gray.
      //
      // Per request, light mode now ALSO gets a warm-gold base underneath
      // this whole stack (the same gradient direction/palette PageBanner
      // uses for its own light-mode banner), rather than staying pinned to
      // the plain dark photo look. Everything layered on top still works
      // unmodified against it EXCEPT the photo (see below).
      className="relative aspect-square w-full overflow-hidden border border-[#262626] light:bg-gradient-to-bl light:from-[#8a5f1e] light:via-[#cf9f45] light:to-[#f0cf7e] md:flex-1"
    >
      {/* background stack - same treatment as the source design, now with a
          slow continuous breathing animation instead of sitting static */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* mix-blend-overlay against the new light-mode gold base would
            crush this photo's dark areas toward black (same reason
            PageBanner's wave photo swaps to mix-blend-screen in light
            mode - see that component's comment for the blend-mode math) -
            light:mix-blend-screen keeps the gold showing through instead. */}
        <Image
          src="/brand/about-photo.png"
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover mix-blend-overlay light:mix-blend-screen"
        />
        {/* The bottom vignette fade is a plain dark ink (#191919) meant to
            ground the dark photo - on the gold base that's now behind it
            in light mode, that same dark fade would paint a muddy brown
            band across the bottom, so light mode swaps it for a matching
            deep-gold fade instead (one raw inline gradient can't carry two
            different end colors via a `light:` class, hence the two
            sibling divs, each shown only in its own theme). */}
        <div
          className="absolute inset-0 light:hidden"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(25,25,25,0) 0%, #191919 90%)",
          }}
        />
        <div
          className="absolute inset-0 hidden light:block"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(138,95,30,0) 0%, #6b4712 90%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: "url(/brand/about-noise-tile.png)",
            backgroundSize: "32px 32px",
            backgroundPosition: "top left",
          }}
        />
        {/* stray lime-green tint substituted with the brand's gold - the
            source Figma layer used rgba(172,255,36,.2), which doesn't match
            AUREX's palette anywhere else and reads as a leftover from a
            different template. */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(212,175,55,0.2)", mixBlendMode: "color" }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(257deg, rgba(255,255,255,0) 79%, rgba(255,255,255,0.3) 100%)",
            mixBlendMode: "overlay",
          }}
        />
        <Image
          src="/brand/about-luminosity.png"
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover opacity-60 mix-blend-luminosity"
        />
      </motion.div>

      {/* crosshair reaching all four edges, reproducing the exact gold
          gradient used by the source line assets, with a gentle pulse */}
      <motion.div
        className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2"
        style={{
          backgroundImage: "linear-gradient(90deg, #d4af37 0%, #e9c349 50%, #d4af37 100%)",
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
        style={{
          backgroundImage: "linear-gradient(180deg, #d4af37 0%, #e9c349 50%, #d4af37 100%)",
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />

      {/* soft grain bloom behind the panel, slowly rotating */}
      <motion.img
        src="/brand/about-shape.svg"
        alt=""
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 size-[257px] -translate-x-1/2 -translate-y-1/2 mix-blend-luminosity"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: easing.smooth }}
        className="absolute left-1/2 top-1/2 flex size-[70px] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden bg-white p-3 shadow-[inset_0_0_23px_16px_rgba(255,255,255,0.5)] sm:size-[100px] sm:p-4"
      >
        {/* Deliberately a different asset from the navbar/footer
            BrandMark, not just a recolor: this badge sits on a white
            surface, and BrandMark's logo-mark.png renders "AUREX" in
            white text - invisible here. Figma uses a dedicated dark-
            text lockup for exactly this spot. */}
        <Image src="/brand/logo-mark-about.png" alt="AUREX" fill sizes="100px" className="object-contain" />
      </motion.div>
    </div>
  );
}
