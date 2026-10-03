"use client";

import { motion } from "framer-motion";

/**
 * A subtle decorative backdrop for a content section: a small "mish-mash"
 * of gold line-art layered behind the real content - two copies of the
 * abstract "Looper BG" swirl (the same vector used behind the hero), at
 * different scale/rotation/mirror so they don't read as one flat repeated
 * shape.
 *
 * (This used to also scatter three thin straight gold-gradient "streak"
 * lines at different angles for extra texture, but on the beige/cream
 * light-mode background those read as a distracting diagonal dashed
 * line rather than subtle texture, so that layer was removed. The
 * continuously-drifting soft gold glow orb that used to move across the
 * swirls was removed too, per request to remove every golden glow
 * happening in the page background - only the static-position line art
 * swirls remain.)
 *
 * The swirls animate on their own: they slowly rotate/breathe, each on its
 * own duration so the whole thing never looks like it's pulsing in
 * lockstep. It's a fully ambient effect (not cursor-tracked like
 * HeroLooperVector) - these sections don't have the hero's large empty
 * canvas for a pointer-following effect to read well.
 *
 * Deliberately the *boosted-opacity* swirl asset (public/brand/looper-bg-
 * glow.svg), not the dim resting one (looper-bg.svg) HeroLooperVector
 * layers underneath its own hover-lit copy: that resting asset has many
 * individual paths at near-zero opacity, so whether it was visible at all
 * came down to luck - which random cluster of paths a given crop/rotation
 * happened to land on. The glow variant's paths are uniformly opaque, so
 * a single low CSS opacity reads consistently across every placement.
 *
 * Light mode gets its own treatment, not just the same gold at the same
 * opacity: the source art is a pale gold gradient designed to glow
 * against a near-black page, and at any opacity that stays washed out
 * against a near-white one - pale gold and off-white sit too close in
 * lightness for opacity alone to fix. A `brightness`/`saturate`/`contrast`
 * filter darkens it into a deeper amber that actually reads as linework
 * on a light surface, plus a straightforwardly higher opacity on top.
 *
 * Every animated value here is opacity or a transform (x/y/rotate/scale),
 * matching the pattern already used for ambient/always-on decoration
 * elsewhere in this project (AboutVisualPanel's rotating grain bloom) -
 * genuinely continuous background motion isn't gated on
 * prefers-reduced-motion the way interactive or timer-driven UI is; the
 * transform values are still auto-neutered by the root layout's
 * <MotionConfig reducedMotion="user"> regardless.
 *
 * Each variant repositions everything differently so the sections this is
 * used in (About, How it Works, Why Aurex, Investment Packages, Leaderboard,
 * Client Perspectives, FAQ, the Coming Soon page, the Contact page's form
 * section, and the 404 page) don't all look/move identically.
 */
const SWIRL_SRC = "/brand/looper-bg-glow.svg";

// Applied to every swirl <img> - a fixed gold-gradient asset can't be
// recolored via a Tailwind text-color class the way currentColor SVGs
// can, so this reaches for a CSS filter instead.
const LIGHT_MODE_FILTER = "light:brightness-50 light:saturate-150 light:contrast-125";

type Swirl = { className: string; rotate: number[]; duration: number };

const VARIANTS: Record<string, { swirls: Swirl[] }> = {
  about: {
    swirls: [
      {
        className: "-left-[18%] -top-[40%] h-[440px] w-[712px] rotate-[9deg] opacity-[0.16] light:opacity-[0.4]",
        rotate: [9, 12, 9],
        duration: 40,
      },
      {
        className:
          "-right-[10%] bottom-[-30%] h-[300px] w-[485px] rotate-[160deg] scale-x-[-1] opacity-[0.09] light:opacity-[0.24]",
        rotate: [160, 156, 160],
        duration: 34,
      },
    ],
  },
  packages: {
    swirls: [
      {
        className:
          "-right-[20%] top-[-15%] h-[420px] w-[680px] -rotate-[7deg] scale-x-[-1] opacity-[0.16] light:opacity-[0.4]",
        rotate: [-7, -11, -7],
        duration: 38,
      },
      {
        className: "-left-[12%] bottom-[-28%] h-[280px] w-[453px] rotate-[24deg] opacity-[0.09] light:opacity-[0.24]",
        rotate: [24, 28, 24],
        duration: 30,
      },
    ],
  },
  testimonials: {
    swirls: [
      {
        className: "left-[6%] -bottom-[35%] h-[400px] w-[648px] rotate-[4deg] opacity-[0.16] light:opacity-[0.4]",
        rotate: [4, 8, 4],
        duration: 36,
      },
      {
        className: "right-[-14%] top-[-32%] h-[260px] w-[421px] rotate-[195deg] scale-x-[-1] opacity-[0.09] light:opacity-[0.24]",
        rotate: [195, 191, 195],
        duration: 32,
      },
    ],
  },
  howItWorks: {
    swirls: [
      {
        className: "-left-[16%] -top-[38%] h-[420px] w-[680px] rotate-[6deg] opacity-[0.16] light:opacity-[0.4]",
        rotate: [6, 10, 6],
        duration: 39,
      },
      {
        className:
          "-right-[12%] bottom-[-32%] h-[290px] w-[469px] rotate-[150deg] scale-x-[-1] opacity-[0.09] light:opacity-[0.24]",
        rotate: [150, 146, 150],
        duration: 33,
      },
    ],
  },
  whyAurex: {
    swirls: [
      {
        className:
          "-right-[18%] -top-[36%] h-[400px] w-[647px] -rotate-[9deg] scale-x-[-1] opacity-[0.16] light:opacity-[0.4]",
        rotate: [-9, -13, -9],
        duration: 37,
      },
      {
        className: "-left-[10%] bottom-[-30%] h-[270px] w-[437px] rotate-[30deg] opacity-[0.09] light:opacity-[0.24]",
        rotate: [30, 34, 30],
        duration: 31,
      },
    ],
  },
  leaderboard: {
    swirls: [
      {
        className:
          "-right-[16%] -top-[34%] h-[410px] w-[663px] rotate-[16deg] scale-x-[-1] opacity-[0.16] light:opacity-[0.4]",
        rotate: [16, 20, 16],
        duration: 40,
      },
      {
        className: "-left-[14%] bottom-[-30%] h-[280px] w-[453px] rotate-[195deg] opacity-[0.09] light:opacity-[0.24]",
        rotate: [195, 199, 195],
        duration: 32,
      },
    ],
  },
  faq: {
    swirls: [
      {
        className: "-left-[14%] -bottom-[38%] h-[380px] w-[615px] rotate-[8deg] opacity-[0.16] light:opacity-[0.4]",
        rotate: [8, 4, 8],
        duration: 41,
      },
      {
        className:
          "-right-[16%] -top-[30%] h-[250px] w-[405px] rotate-[205deg] scale-x-[-1] opacity-[0.09] light:opacity-[0.24]",
        rotate: [205, 209, 205],
        duration: 35,
      },
    ],
  },
  comingSoon: {
    swirls: [
      {
        className: "-left-[15%] -top-[35%] h-[460px] w-[744px] rotate-[12deg] opacity-[0.16] light:opacity-[0.4]",
        rotate: [12, 16, 12],
        duration: 42,
      },
      {
        className:
          "-right-[16%] -bottom-[32%] h-[340px] w-[550px] rotate-[172deg] scale-x-[-1] opacity-[0.1] light:opacity-[0.26]",
        rotate: [172, 168, 172],
        duration: 36,
      },
    ],
  },
  contact: {
    swirls: [
      {
        className: "-right-[16%] -top-[36%] h-[420px] w-[680px] rotate-[14deg] scale-x-[-1] opacity-[0.16] light:opacity-[0.4]",
        rotate: [14, 18, 14],
        duration: 38,
      },
      {
        className: "-left-[12%] bottom-[-28%] h-[280px] w-[453px] rotate-[188deg] opacity-[0.09] light:opacity-[0.24]",
        rotate: [188, 184, 188],
        duration: 33,
      },
    ],
  },
  notFound: {
    swirls: [
      {
        className: "-right-[14%] -top-[38%] h-[440px] w-[712px] rotate-[20deg] opacity-[0.16] light:opacity-[0.4]",
        rotate: [20, 24, 20],
        duration: 41,
      },
      {
        className: "-left-[16%] bottom-[-34%] h-[300px] w-[485px] rotate-[200deg] scale-x-[-1] opacity-[0.09] light:opacity-[0.24]",
        rotate: [200, 196, 200],
        duration: 35,
      },
    ],
  },
};

export type SectionVectorVariant = keyof typeof VARIANTS;

export default function SectionBackgroundVector({
  variant,
}: {
  variant: SectionVectorVariant;
}) {
  const cfg = VARIANTS[variant];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {cfg.swirls.map((swirl, i) => (
        <motion.img
          key={`swirl-${i}`}
          src={SWIRL_SRC}
          alt=""
          className={`absolute ${swirl.className} ${LIGHT_MODE_FILTER}`}
          animate={{ rotate: swirl.rotate }}
          transition={{ duration: swirl.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
