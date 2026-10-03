"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import SectionBackgroundVector from "@/components/SectionBackgroundVector";
import { TrendUpIcon, TrendDownIcon, TrendFlatIcon } from "@/components/icons";

// Per Figma node 252:5570 ("Section" - the actual home-page Investor
// Leaderboard section; node 252:5577 from the link given for this section
// is just that frame's empty background-paint layer, not the content - see
// its parent for the real design). Heading/subtitle copy and all 10 mock
// investors' numbers below are taken directly from that node, which is why
// they already lined up exactly with what this section had before this
// pass - only the visual treatment changes here.
//
// Points scale: 1 point per $100 invested, rounded to the nearest 10 -
// arbitrary but consistent, purely to turn a dollar figure into a
// "leaderboard score" that isn't literally a bank balance.
const POINTS_PER_DOLLAR = 1 / 100;
const toPoints = (invested: number) => Math.round((invested * POINTS_PER_DOLLAR) / 10) * 10;

// `change` is how many places each investor has moved since the last
// ranking period - positive climbs, negative drops, 0 holds position.
const INVESTORS = [
  { nickname: "IronVault", invested: 1_240_000, change: 1 },
  { nickname: "GoldFalcon", invested: 980_000, change: -1 },
  { nickname: "SilkRoad88", invested: 865_000, change: 2 },
  { nickname: "NorthStarX", invested: 742_000, change: 0 },
  { nickname: "CrestlineJ", invested: 689_000, change: 3 },
  { nickname: "AtlasReturn", invested: 612_000, change: -2 },
  { nickname: "MidasTouch", invested: 578_000, change: 1 },
  { nickname: "QuietCapital", invested: 524_000, change: 0 },
  { nickname: "EmberYield", invested: 493_000, change: -1 },
  { nickname: "VaultKeeper", invested: 461_000, change: 4 },
].map((investor, i) => ({
  ...investor,
  rank: i + 1,
  points: toPoints(investor.invested),
  initials: investor.nickname.slice(0, 2).toUpperCase(),
}));

const TOP_THREE = INVESTORS.slice(0, 3);
const REST = INVESTORS.slice(3);

// Per-rank medal treatment - the avatar ring gradient plus the exported
// trophy badge icon from the Figma reference (public/brand/leaderboard-
// trophy-{1st,2nd,3rd}.svg, downloaded from that node rather than redrawn,
// per the design-to-code asset-fidelity rule), its "First/Second/Third
// place" label, and `stepHeight` - three genuinely distinct step heights
// (sm+ only; below sm the mobile-only podium markup further down has its
// own separate `mobileStepHeight`/`mobileCorner`), per request that the
// podium not read as equal-height blocks - including 2nd vs 3rd, not just
// 1st vs the other two. Paired with `sm:items-end` on the row below, the
// height difference alone is what visually elevates 1st place - no
// separate negative-margin hack needed on top of it.
//
// `mobileBg`/`mobileText`/`mobileNumberSize` are for the separate mobile-
// only podium further down (per Figma node 286:3172 - a later, distinct
// reference from 241:2622's arch pillars, confirmed against the user's own
// real data: same nicknames/points as this file's own INVESTORS). Per
// follow-up feedback, only 1st keeps its own distinct standout color
// (`mobileBg`/#b68409) - 2nd and 3rd now both use the exact same gold
// gradient the rest of the app's buttons already use (Join Aurex,
// LeaderboardView's "Get Started" - see lib's own gold/gold-light tokens),
// rather than two different one-off gold-brown shades, so they read as
// "the system's regular gold," secondary to 1st's own standout look -
// which is also why they need dark text (mobileText) instead of white:
// that gradient is light enough that white stops being readable on it,
// same reasoning every other gold button on the site already follows.
const MEDALS: Record<
  number,
  {
    ring: string;
    trophy: string;
    label: string;
    stepHeight: string;
    mobileStepHeight: string;
    mobileBg: string;
    mobileText: string;
    mobileTextDim: string;
    mobileNumberSize: string;
  }
> = {
  1: {
    ring: "from-[#f2ca50] to-[#a67c1f]",
    trophy: "/brand/leaderboard-trophy-1st.svg",
    label: "First place",
    stepHeight: "sm:min-h-[200px]",
    mobileStepHeight: "min-h-[220px]",
    mobileBg: "bg-[#b68409]",
    mobileText: "text-white",
    mobileTextDim: "text-white/90",
    mobileNumberSize: "text-5xl",
  },
  2: {
    ring: "from-[#e8e8e8] to-[#9a9a9a]",
    trophy: "/brand/leaderboard-trophy-2nd.svg",
    label: "Second place",
    stepHeight: "sm:min-h-[160px]",
    mobileStepHeight: "min-h-[178px]",
    mobileBg: "bg-gradient-to-r from-gold via-gold-light via-50% to-gold",
    mobileText: "text-amainblack",
    mobileTextDim: "text-amainblack/80",
    mobileNumberSize: "text-4xl",
  },
  3: {
    ring: "from-[#d7a06b] to-[#8c5a34]",
    trophy: "/brand/leaderboard-trophy-3rd.svg",
    label: "Third place",
    stepHeight: "sm:min-h-[125px]",
    mobileStepHeight: "min-h-[136px]",
    mobileBg: "bg-gradient-to-r from-gold via-gold-light via-50% to-gold",
    mobileText: "text-amainblack",
    mobileTextDim: "text-amainblack/80",
    mobileNumberSize: "text-3xl",
  },
};

function ChangeIndicator({ change }: { change: number }) {
  if (change === 0) {
    return (
      <span className="flex items-center gap-1 text-neutral-500">
        <TrendFlatIcon className="size-2.5" />
        <span className="font-geist text-xs">Holding</span>
      </span>
    );
  }
  const isUp = change > 0;
  return (
    <span className={`flex items-center gap-1 ${isUp ? "text-[#4ade80]" : "text-[#f87171]"}`}>
      {isUp ? <TrendUpIcon className="size-2.5" /> : <TrendDownIcon className="size-2.5" />}
      <span className="font-geist text-xs">{Math.abs(change)}</span>
    </span>
  );
}

// Podium display order (silver, gold, bronze), rank 1 elevated above the
// other two - used by both the sm+ podium below and the separate mobile-
// only podium further down. No sm: split needed anymore: the mobile podium
// used to stack full-width steps in plain rank order (1, 2, 3) since the
// side-by-side effect only read once there was room, but it's now its own
// side-by-side layout too (per the Figma mobile podium reference), so both
// breakpoints want the same 2nd/1st/3rd arrangement.
const PODIUM_ORDER: Record<number, string> = { 1: "order-2", 2: "order-1", 3: "order-3" };

export default function Leaderboard() {
  return (
    <section
      id="leaderboard"
      className="relative w-full overflow-hidden border border-grid-line px-6 py-16 sm:px-10 sm:py-20 md:px-16 md:py-24 lg:px-[100px]"
    >
      <SectionBackgroundVector variant="leaderboard" />
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        className="flex flex-col items-center gap-12 sm:gap-16"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <motion.h2
            variants={staggerItem}
            className="font-jakarta text-2xl font-semibold tracking-tight text-cream sm:text-3xl lg:text-4xl"
          >
            Investor Leaderboard
          </motion.h2>
          <motion.p variants={staggerItem} className="max-w-xl font-sans text-sm text-cream-dim sm:text-base">
            The top 10 AUREX members this cycle, ranked by points earned on
            capital invested.
          </motion.p>
        </div>

        {/* Podium: avatar + nickname float above a "step" block per rank
            (Figma's own literal podium metaphor), no glow blob behind the
            row (removed per request to remove every golden glow from the
            page background). Per follow-up feedback ("the podium doesn't
            need to be black for light mode"), the step's own colors flip
            with the theme like every other card in the app - dark mode
            keeps the Figma reference's black top, light mode gets its own
            warm, light equivalent instead of staying pinned dark. Every
            color on/in the step (avatar circle, trophy label, points,
            divider) uses the normal flipping tokens again for the same
            reason.

            No border on the step itself, in either theme - the current
            Figma reference blends the step into the page background rather
            than framing it as a distinct card. The beveled top facet and
            the step's own content (trophy, label, points) are what define
            its shape, not an outline or a fill color of its own: the
            gradient's bottom stop is `ink` in both themes - the exact page
            background color, not an approximation - so the step trails off
            into the page seamlessly instead of visibly ending partway
            down. (Light mode's bottom stop used to be a warm cream - closer
            to the intent than a plain white card, but still its own tint
            rather than a true blend, and read as a soft yellow glow at the
            step's base - `ink` is the actual fix, not just a duller cream.)

            hidden below sm: the mobile-only podium markup right after this
            one (per Figma node 241:2622, the design's own dedicated mobile
            podium layout) takes over there instead of this sm+ version
            reflowing to a narrow-screen layout of its own. */}
        <motion.div variants={staggerItem} className="relative hidden w-full max-w-3xl sm:block">
          {/* sm:gap-0 - per the Figma reference, the three steps sit flush
              against each other (confirmed against the raw node positions:
              the middle step's right edge and the right step's left edge
              are 1px apart, i.e. touching), not spaced apart like separate
              cards. The narrower top of each step's own beveled facet still
              leaves a small triangular notch of page background visible
              between neighbors near the top - that's the reference's own
              look, not a gap that needs closing. gap-6 below sm is kept:
              stacked full-width steps need real separation to read as
              distinct rows once they're no longer side-by-side. */}
          <div className="relative flex flex-col items-stretch gap-6 sm:flex-row sm:items-end sm:justify-center sm:gap-0">
            {TOP_THREE.map((investor) => {
              const medal = MEDALS[investor.rank];
              const isFirst = investor.rank === 1;
              return (
                <div
                  key={investor.nickname}
                  className={`${PODIUM_ORDER[investor.rank]} flex flex-1 flex-col items-center`}
                >
                  <div
                    className={`flex items-center justify-center rounded-full bg-gradient-to-br p-[3px] ${medal.ring}`}
                  >
                    <div
                      className={`flex items-center justify-center rounded-full bg-panel text-gold-bright ${
                        isFirst ? "size-16 sm:size-20" : "size-14 sm:size-16"
                      }`}
                    >
                      <span className={`font-jakarta font-bold ${isFirst ? "text-xl sm:text-2xl" : "text-lg"}`}>
                        {investor.initials}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 font-jakarta text-base font-semibold text-cream sm:text-lg">
                    {investor.nickname}
                  </p>

                  <div className="mt-4 flex w-full flex-col items-center">
                    {/* Beveled top facet - reproduces the Figma reference's
                        "Vector 193" shape exactly: a trapezoid, narrower at
                        the top than the bottom, giving the step a faceted
                        3D edge instead of a plain rounded corner (there's no
                        border-radius anywhere on this element in the
                        source design - square corners are AUREX's own
                        established chrome, same as CustomSelect's popup).
                        The facet is also its own gradient, not a flat fill -
                        the light-mode source asset shades from white at the
                        top to a cool gray (#cbd5e0) at the bottom, giving
                        the facet a soft highlight-to-shadow look rather than
                        a flat paper cutout. Dark mode has no equivalent
                        asset in the source file (it's a light-mode-only
                        design), so this carries the same idea over in dark
                        mode's own palette - a dark gray highlight fading to
                        the step's own black, kept subtle (not the lighter
                        gray it started as, per feedback that read as too
                        light against the step) rather than inventing a new
                        unrelated color. */}
                    <div
                      aria-hidden="true"
                      className="h-3 w-full bg-gradient-to-b from-[#2a2a2a] to-black light:from-white light:to-[#cbd5e0] sm:h-4"
                      style={{ clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)" }}
                    />
                    {/* justify-between spreads the trophy/label group up
                        top and the points/change group down toward the
                        bottom, so the taller 1st-place step reads as a
                        genuinely bigger plaque instead of just empty
                        padding under the same content. */}
                    <div
                      className={`flex w-full flex-col items-center justify-between gap-2 bg-gradient-to-b from-black to-ink px-4 pb-5 pt-3 text-center light:from-white light:to-ink ${medal.stepHeight}`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={medal.trophy} alt="" className="size-[30px]" />
                        <span className="font-jakarta text-xs font-medium text-cream">{medal.label}</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <p className="flex items-baseline gap-1.5 border-t border-cream/10 pt-2">
                          <span className="font-jakarta text-2xl font-bold text-gold-bright sm:text-3xl">
                            {investor.points.toLocaleString()}
                          </span>
                          <span className="font-jakarta text-xs text-cream-dim">pts</span>
                        </p>
                        <ChangeIndicator change={investor.change} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Mobile podium - per Figma node 286:3172 ("top three"), a later,
            distinct reference from the arch-pillar design this replaces
            (node 241:2622 - confirmed as the newer direction against the
            user's own real data: same nicknames/points as this file's own
            INVESTORS). Solid flat color per rank (mobileBg - deliberately
            NOT a theme-flipping token: the reference shows one fixed look
            regardless of page theme, unlike the sm+ podium's own light/
            dark-aware "blend into background" treatment, which is
            untouched and still sm+ only) instead of an arch shape: name +
            points sit inside the block near the top, the rank-change
            indicator in its top-left corner, and a huge rank number
            anchored to the bottom - tallest/brightest/biggest-numeral for
            1st, per the source. Square corners throughout (no
            border-radius anywhere on this element in the source design -
            AUREX's own established chrome, same as CustomSelect's popup).
            No crown accent this time; the source doesn't have one. */}
        <motion.div variants={staggerItem} className="relative w-full max-w-3xl sm:hidden">
          {/* gap-0 - per the Figma reference, the three blocks sit flush
              against each other (the "top three" frame is exactly 288px
              wide, 96px × 3 with no gap between), not spaced apart. */}
          <div className="relative flex items-end justify-center gap-0">
            {TOP_THREE.map((investor) => {
              const medal = MEDALS[investor.rank];
              return (
                <div
                  key={investor.nickname}
                  className={`${PODIUM_ORDER[investor.rank]} flex flex-1 flex-col items-center`}
                >
                  <div className={`z-10 flex items-center justify-center rounded-full bg-gradient-to-br p-[2.5px] ${medal.ring}`}>
                    <div className="flex size-9 items-center justify-center rounded-full bg-panel text-gold-bright">
                      <span className="font-jakarta text-xs font-bold">{investor.initials}</span>
                    </div>
                  </div>

                  <div
                    className={`relative -mt-4 flex w-full flex-col items-center gap-0.5 px-2 pb-2 pt-6 text-center ${medal.mobileBg} ${medal.mobileStepHeight}`}
                  >
                    <span className="absolute left-1.5 top-1.5">
                      <ChangeIndicator change={investor.change} />
                    </span>

                    <span className={`w-full truncate font-jakarta text-xs font-black ${medal.mobileText}`}>
                      {investor.nickname}
                    </span>
                    <span className={`font-jakarta text-[11px] font-semibold ${medal.mobileTextDim}`}>
                      {investor.points.toLocaleString()} pts
                    </span>

                    <span className={`mt-auto font-jakarta font-black leading-none ${medal.mobileText} ${medal.mobileNumberSize}`}>
                      {investor.rank}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Ranks 4-10 as a plain scannable list, per the Figma reference -
            each row a HorizontalBorder divider (border-gold/20), not a
            grouped/pill row. */}
        <motion.div variants={staggerItem} className="flex w-full max-w-3xl flex-col">
          {REST.map((investor) => (
            <div
              key={investor.nickname}
              className="flex items-center gap-4 border-b border-gold/20 py-4 first:pt-0 last:border-b-0"
            >
              <span className="w-6 shrink-0 font-geist text-sm font-semibold text-cream-dim">{investor.rank}</span>

              <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-[#3d392f] light:bg-[#eee]">
                <span className="font-jakarta text-xs font-bold text-gold-bright">{investor.initials}</span>
              </div>

              <span className="flex-1 truncate font-jakarta text-sm font-medium text-cream sm:text-base">
                {investor.nickname}
              </span>

              <span className="shrink-0 font-jakarta text-sm font-semibold text-gold-bright sm:text-base">
                {investor.points.toLocaleString()} <span className="text-xs font-normal text-cream-dim">pts</span>
              </span>

              <span className="w-14 shrink-0 text-right">
                <ChangeIndicator change={investor.change} />
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
