"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, hoverScale } from "@/lib/motion";
import JoinAurexModal from "@/components/JoinAurexModal";
import { toPoints, type LeaderboardEntry } from "@/lib/leaderboard";

// How many ranks (beyond the top 3) are shown before "Load More" is needed
// — with 20 mock rows total (see lib/leaderboard.ts) this shows one full
// page of 10 up front and needs exactly one click to reveal the rest, so
// both the initial state and the "more available" state are easy to see
// without scrolling through a wall of rows first.
const PAGE_SIZE = 10;

// Same per-rank medal treatment as the home page's teaser (components/
// Leaderboard.tsx) — kept independent here rather than shared, since this
// page's podium cards are a different size/copy and that component's own
// comments are specific to being a home-page teaser section. Per Figma node
// 252:5570 (the actual Investor Leaderboard section design — see
// Leaderboard.tsx's own comment on why 252:5577 from the link isn't it):
// `trophy` is the exported per-rank badge icon (public/brand/leaderboard-
// trophy-{1st,2nd,3rd}.svg) and `label` the "First/Second/Third place" text
// shown with it. `stepHeight` gives three genuinely distinct step heights
// (sm+ only — see the home page teaser's own comment for the mobile-only
// `mobileBg`/`mobileText`/`mobileTextDim`/`mobileNumberSize` fields' own
// reasoning, including why only 1st keeps its own standout color and 2nd/
// 3rd both use the app's regular gold-button gradient instead), per
// request that the podium not read as equal-height blocks — including
// 2nd vs 3rd, not just 1st vs the other two.
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
    stepHeight: "sm:min-h-[220px]",
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
    stepHeight: "sm:min-h-[175px]",
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
    stepHeight: "sm:min-h-[135px]",
    mobileStepHeight: "min-h-[136px]",
    mobileBg: "bg-gradient-to-r from-gold via-gold-light via-50% to-gold",
    mobileText: "text-amainblack",
    mobileTextDim: "text-amainblack/80",
    mobileNumberSize: "text-3xl",
  },
};

// Podium display order (silver, gold, bronze), rank 1 raised above the
// other two — used by both the sm+ podium below and the separate mobile-
// only podium further down. See the home page teaser's own comment
// (components/Leaderboard.tsx) for why this no longer needs an sm: split.
const PODIUM_ORDER: Record<number, string> = { 1: "order-2", 2: "order-1", 3: "order-3" };

// Always render all three podium slots; ranks with no investor yet get an
// "Open spot" placeholder so 1-2 entries still read as a podium.
const PODIUM_RANKS = [1, 2, 3];

function isCurrentUser(nickname: string, currentUserNickname?: string) {
  if (!currentUserNickname) return false;
  return nickname.trim().toLowerCase() === currentUserNickname.trim().toLowerCase();
}

function YouTag() {
  return (
    <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-gold-bright/60 bg-gold-bright/10 px-2.5 py-0.5 font-jakarta text-[10px] font-medium uppercase tracking-wide text-gold-bright">
      You
    </span>
  );
}

/**
 * The full /leaderboard page body: podium (top 3) + paginated list (rank
 * 4+) + the "join us" CTA, all in one client component since ranking,
 * "Load More", and the current-user match all need client state/render
 * logic together.
 *
 * `entries` comes from lib/leaderboard.ts's mock `getLeaderboard()` today;
 * this component only ever reads a flat, already-ranked array, so nothing
 * here changes when that's swapped for a real endpoint later.
 *
 * `currentUserNickname` is optional and drives three things: which row (if
 * any, anywhere in the list — podium included) gets a "You" tag and a
 * gold highlight; whether the bottom join CTA renders at all (a
 * registered investor viewing their own dashboard's link here doesn't need
 * to be pitched to join); and — when that nickname actually appears in
 * `entries` — a "Your Position" callout up top with a jump-to-your-row
 * action, so finding yourself doesn't mean scrolling/Load-More-ing
 * through everyone ranked above you. Passed in from app/leaderboard/
 * page.tsx as a `?me=` query param, or from the dashboard's own embedded
 * leaderboard tab with the signed-in member's real nickname — see each
 * call site's own comment.
 */
export default function LeaderboardView({
  entries,
  currentUserNickname,
}: {
  entries: LeaderboardEntry[];
  currentUserNickname?: string;
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  // Set by "Jump to My Rank" when the target row isn't rendered yet (rank
  // beyond the current visibleCount) — a ref, not state, since it doesn't
  // need to trigger its own re-render: growing visibleCount already does
  // that, and the effect below just needs to read it once that happens.
  const pendingScrollRankRef = useRef<number | null>(null);

  const topThree = entries.slice(0, 3);
  const rest = entries.slice(3);
  const visibleRest = rest.slice(0, visibleCount);
  const hasMore = visibleCount < rest.length;

  const myEntry = currentUserNickname
    ? entries.find((entry) => isCurrentUser(entry.nickname, currentUserNickname))
    : undefined;

  // A registered member (identified by the presence of their own nickname)
  // never sees the "come join us" pitch — it's aimed at the logged-out
  // visitors who are this page's primary audience, per the brief.
  const showJoinCta = !currentUserNickname;

  // Ranks 1-3 render twice now — once in the sm+ podium, once in the
  // mobile-only podium (components/leaderboard/LeaderboardView.tsx's own
  // "hidden below sm" / "sm:hidden" pair) — so an `id` per rank would
  // collide between the two copies. Both use `data-leaderboard-rank`
  // instead (ranks 4+ only ever render once, but use the same attribute
  // for one consistent lookup rather than splitting id vs data-attribute
  // by rank range), and this picks whichever copy is actually the
  // currently-visible one (`offsetParent !== null` — cheap, reliable
  // "is this laid out/visible" check that doesn't require reading computed
  // styles) rather than always the first in document order, which would
  // silently scroll to a `display:none` element on the "wrong" breakpoint.
  function scrollToRank(rank: number) {
    const rows = document.querySelectorAll<HTMLElement>(`[data-leaderboard-rank="${rank}"]`);
    const target = Array.from(rows).find((el) => el.offsetParent !== null) ?? rows[0];
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Re-runs whenever visibleCount grows — the one moment a row that didn't
  // exist yet (rank > 3, beyond the previous page) shows up in the DOM.
  useEffect(() => {
    const rank = pendingScrollRankRef.current;
    if (rank === null) return;
    scrollToRank(rank);
    pendingScrollRankRef.current = null;
  }, [visibleCount]);

  function handleJumpToMyRank() {
    if (!myEntry) return;
    const neededCount = myEntry.rank - 3;
    // Ranks 4+ only render up to `visibleCount` of them. If the row is
    // already in the DOM (podium, or already-revealed page), scroll to it
    // right away; otherwise grow visibleCount and let the effect above
    // scroll to it once it actually exists.
    if (myEntry.rank > 3 && neededCount > visibleCount) {
      pendingScrollRankRef.current = myEntry.rank;
      setVisibleCount(neededCount);
      return;
    }
    scrollToRank(myEntry.rank);
  }

  return (
    <>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex w-full flex-col gap-12 py-12 sm:gap-16 sm:py-16"
      >
        {/* "Your Position" — only when the current user's own nickname
            actually appears in `entries` (an investor; a Business Owner
            viewing this from their own dashboard never matches a row).
            Sits above the podium so it's the first thing you see, not
            something you have to scroll or Load More to find. */}
        {myEntry && (
          <motion.div
            variants={staggerItem}
            className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-4 border border-gold-bright/40 bg-gold-bright/5 px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold-bright/50 font-jakarta text-sm font-bold text-gold-bright">
                #{myEntry.rank}
              </span>
              <div className="flex flex-col">
                <span className="font-jakarta text-sm font-semibold text-cream">Your Position</span>
                <span className="font-sans text-xs text-cream-dim">
                  {toPoints(myEntry.amountInvestedGhs).toLocaleString()} pts
                </span>
              </div>
            </div>
            <motion.button
              {...hoverScale}
              type="button"
              onClick={handleJumpToMyRank}
              className="font-jakarta text-sm font-medium text-gold-bright underline-offset-4 hover:underline"
            >
              Jump to my rank →
            </motion.button>
          </motion.div>
        )}

        {entries.length === 0 && (
          <motion.div
            variants={staggerItem}
            className="mx-auto flex w-full max-w-3xl flex-col items-center gap-2 border border-grid-line py-16 text-center"
          >
            <p className="font-jakarta text-lg font-semibold text-cream">No one is on the leaderboard yet.</p>
            <p className="max-w-sm font-sans text-sm text-cream-dim">
              Rankings appear here as soon as investors start investing. Check back soon.
            </p>
          </motion.div>
        )}

        {entries.length > 0 && (
          <>
        {/* Podium: avatar + nickname float above a "step" block per rank
            (Figma's own literal podium metaphor), no glow blob behind the
            row anymore (removed per request to remove every golden glow
            from the page background), and no border on the step itself in
            either theme — the current Figma reference blends the step into
            the page background rather than framing it as a distinct card.
            See the home page teaser's own comment (components/
            Leaderboard.tsx) for the full reasoning on both.

            hidden below sm: the mobile-only podium markup right after this
            one (per Figma node 241:2622, the design's own dedicated mobile
            podium layout) takes over there instead. */}
        <motion.div variants={staggerItem} className="relative hidden w-full sm:block">
          {/* sm:gap-0 — see the home page teaser's own comment
              (components/Leaderboard.tsx) for why: per the Figma reference,
              the three steps sit flush against each other, not spaced apart
              like separate cards. */}
          <div className="relative mx-auto flex max-w-4xl flex-col items-stretch gap-6 sm:flex-row sm:items-end sm:justify-center sm:gap-0">
            {PODIUM_RANKS.map((rank) => {
              const entry = topThree[rank - 1];
              if (!entry) {
                const emptyMedal = MEDALS[rank];
                return (
                  <div key={`empty-${rank}`} className={`${PODIUM_ORDER[rank]} flex flex-1 flex-col items-center`}>
                    <div
                      className={`flex items-center justify-center rounded-full border-2 border-dashed border-grid-line text-cream-dim ${
                        rank === 1 ? "size-20 sm:size-24" : "size-16 sm:size-20"
                      }`}
                    >
                      <span className="font-jakarta text-2xl font-bold">?</span>
                    </div>
                    <p className="mt-3 font-jakarta text-lg font-semibold italic text-cream-dim sm:text-xl">Open spot</p>
                    <div className="mt-4 flex w-full flex-col items-center">
                      <div
                        aria-hidden="true"
                        className="h-3 w-full bg-grid-line sm:h-4"
                        style={{ clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)" }}
                      />
                      <div
                        className={`flex w-full flex-col items-center justify-between gap-2 border-x border-b border-dashed border-grid-line px-4 pb-6 pt-4 text-center ${emptyMedal.stepHeight}`}
                      >
                        <span className="font-jakarta text-sm font-medium text-cream-dim">{emptyMedal.label}</span>
                        <p className="border-t border-cream/10 pt-2 font-jakarta text-sm text-cream-dim">
                          Waiting for an investor
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              const medal = MEDALS[entry.rank];
              const isFirst = entry.rank === 1;
              const mine = isCurrentUser(entry.nickname, currentUserNickname);
              const initials = entry.nickname.slice(0, 2).toUpperCase();

              return (
                <div
                  key={entry.nickname}
                  data-leaderboard-rank={entry.rank}
                  className={`${PODIUM_ORDER[entry.rank]} flex flex-1 flex-col items-center`}
                >
                  {mine && <YouTag />}

                  <div className={`flex items-center justify-center rounded-full bg-gradient-to-br p-[3px] ${medal.ring} ${mine ? "mt-1" : ""}`}>
                    <div
                      className={`flex items-center justify-center rounded-full bg-panel text-gold-bright ${
                        isFirst ? "size-20 sm:size-24" : "size-16 sm:size-20"
                      }`}
                    >
                      <span className={`font-jakarta font-bold ${isFirst ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
                        {initials}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 font-jakarta text-lg font-semibold text-cream sm:text-xl">{entry.nickname}</p>

                  {/* mine's own ring flags "your" podium step without
                      changing the block's own fill, so it stays the same
                      literal "podium step" the reference uses whether or
                      not it happens to be the viewer's own rank. */}
                  <div className="mt-4 flex w-full flex-col items-center">
                    {/* Beveled top facet — see the home page teaser's own
                        comment for the shape/gradient reasoning; same
                        white-to-gray (light) / gray-to-black (dark)
                        highlight-to-shadow treatment here. */}
                    <div
                      aria-hidden="true"
                      className="h-3 w-full bg-gradient-to-b from-[#2a2a2a] to-black light:from-white light:to-[#cbd5e0] sm:h-4"
                      style={{ clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)" }}
                    />
                    {/* justify-between spreads the trophy/label group up
                        top and the points group down toward the bottom, so
                        the taller 1st-place step reads as a genuinely
                        bigger plaque instead of just empty padding under
                        the same content. */}
                    <div
                      className={`flex w-full flex-col items-center justify-between gap-2 bg-gradient-to-b from-black to-ink px-4 pb-6 pt-4 text-center light:from-white light:to-ink ${medal.stepHeight} ${
                        mine ? "ring-2 ring-inset ring-gold-bright" : ""
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={medal.trophy} alt="" className="size-[34px]" />
                        <span className="font-jakarta text-sm font-medium text-cream">{medal.label}</span>
                      </div>
                      <p className="flex items-baseline gap-1.5 border-t border-cream/10 pt-2">
                        <span className="font-jakarta text-2xl font-bold text-gold-bright sm:text-3xl">
                          {toPoints(entry.amountInvestedGhs).toLocaleString()}
                        </span>
                        <span className="font-jakarta text-sm text-cream-dim">pts</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Mobile podium — see the home page teaser's own comment
            (components/Leaderboard.tsx) for the full reasoning (Figma node
            286:3172, replacing the arch-pillar design from 241:2622); same
            structure here, plus this page's own "mine" highlight (a gold
            ring around the step, same accent the sm+ version uses, and
            YouTag above the avatar). No change-indicator corner badge on
            this page's own podium — unlike the home teaser's own mock data
            (INVESTORS, with its own `change` field), `LeaderboardEntry`
            carries no rank-change data to show one for. */}
        <motion.div variants={staggerItem} className="relative w-full sm:hidden">
          {/* gap-0 — see the home page teaser's own comment for why: the
              three blocks sit flush against each other in the reference,
              not spaced apart. */}
          <div className="relative mx-auto flex max-w-3xl items-end justify-center gap-0">
            {PODIUM_RANKS.map((rank) => {
              const entry = topThree[rank - 1];
              if (!entry) {
                const emptyMedal = MEDALS[rank];
                return (
                  <div key={`empty-${rank}`} className={`${PODIUM_ORDER[rank]} flex flex-1 flex-col items-center`}>
                    <div className="z-10 flex size-9 items-center justify-center rounded-full border-2 border-dashed border-grid-line bg-panel text-cream-dim">
                      <span className="font-jakarta text-xs font-bold">?</span>
                    </div>
                    <div
                      className={`relative -mt-4 flex w-full flex-col items-center gap-0.5 border border-dashed border-grid-line px-2 pb-2 pt-6 text-center ${emptyMedal.mobileStepHeight}`}
                    >
                      <span className="w-full truncate font-jakarta text-xs font-semibold italic text-cream-dim">
                        Open spot
                      </span>
                      <span className="mt-auto font-jakarta font-black leading-none text-cream-dim/60 text-3xl">
                        {rank}
                      </span>
                    </div>
                  </div>
                );
              }

              const medal = MEDALS[entry.rank];
              const mine = isCurrentUser(entry.nickname, currentUserNickname);
              const initials = entry.nickname.slice(0, 2).toUpperCase();

              return (
                <div
                  key={entry.nickname}
                  data-leaderboard-rank={entry.rank}
                  className={`${PODIUM_ORDER[entry.rank]} flex flex-1 flex-col items-center`}
                >
                  {mine && <YouTag />}

                  <div className={`z-10 flex items-center justify-center rounded-full bg-gradient-to-br p-[2.5px] ${medal.ring} ${mine ? "mt-1" : ""}`}>
                    <div className="flex size-9 items-center justify-center rounded-full bg-panel text-gold-bright">
                      <span className="font-jakarta text-xs font-bold">{initials}</span>
                    </div>
                  </div>

                  <div
                    className={`relative -mt-4 flex w-full flex-col items-center gap-0.5 px-2 pb-2 pt-6 text-center ${medal.mobileBg} ${medal.mobileStepHeight} ${
                      mine ? "ring-2 ring-inset ring-gold-bright" : ""
                    }`}
                  >
                    <span className={`w-full truncate font-jakarta text-xs font-black ${medal.mobileText}`}>{entry.nickname}</span>
                    <span className={`font-jakarta text-[11px] font-semibold ${medal.mobileTextDim}`}>
                      {toPoints(entry.amountInvestedGhs).toLocaleString()} pts
                    </span>

                    <span className={`mt-auto font-jakarta font-black leading-none ${medal.mobileText} ${medal.mobileNumberSize}`}>
                      {entry.rank}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Ranks 4+: a clean, scannable, paginated list — per the Figma
            reference, each row a plain HorizontalBorder divider
            (border-gold/20), not a grouped/pill row. */}
        <motion.div variants={staggerItem} className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8">
          <div className="flex w-full flex-col">
            {visibleRest.map((entry) => {
              const mine = isCurrentUser(entry.nickname, currentUserNickname);
              const initials = entry.nickname.slice(0, 2).toUpperCase();

              return (
                <div
                  key={entry.nickname}
                  data-leaderboard-rank={entry.rank}
                  className={`flex items-center gap-4 border-b border-gold/20 px-3 py-4 first:pt-0 last:border-b-0 ${
                    mine ? "border-l-2 border-l-gold-bright bg-gold-bright/5" : ""
                  }`}
                >
                  <span className="w-8 shrink-0 font-geist text-sm font-semibold text-cream-dim">{entry.rank}</span>

                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-[#3d392f] light:bg-[#eee]">
                    <span className="font-jakarta text-xs font-bold text-gold-bright">{initials}</span>
                  </div>

                  <span className="flex flex-1 items-center gap-2 truncate font-jakarta text-sm font-medium text-cream sm:text-base">
                    {entry.nickname}
                    {mine && <YouTag />}
                  </span>

                  <span className="shrink-0 font-jakarta text-sm font-semibold text-gold-bright sm:text-base">
                    {toPoints(entry.amountInvestedGhs).toLocaleString()}{" "}
                    <span className="text-xs font-normal text-cream-dim">pts</span>
                  </span>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <motion.button
              {...hoverScale}
              type="button"
              onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
              className="flex items-center justify-center border border-gold/30 px-6 py-3 font-jakarta text-sm font-medium text-gold-bright transition-colors hover:border-gold hover:bg-gold/5"
            >
              Load More
            </motion.button>
          )}
        </motion.div>

          </>
        )}

        {/* Bottom CTA — hidden entirely for a viewer we already know is a
            registered member (currentUserNickname set), per the brief. */}
        {showJoinCta && (
          <motion.div
            variants={staggerItem}
            className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 border border-gold/20 bg-ink-light/20 p-8 text-center sm:p-10"
          >
            <p className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">Want to see your name here?</p>
            <p className="max-w-md font-sans text-sm text-cream-dim sm:text-base">
              Join AUREX and start building your own place on the leaderboard.
            </p>
            <motion.button
              {...hoverScale}
              type="button"
              onClick={() => setJoinModalOpen(true)}
              className="mt-2 flex items-center justify-center bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3 font-jakarta text-sm text-amainblack"
            >
              Get Started
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Same JoinAurexModal used by the navbar/CTASection — rendered as a
          sibling of the scrolling content above rather than nested inside
          it, so its `fixed inset-0` resolves against the viewport (see
          Navbar.tsx / CTASection.tsx's own comments on this). */}
      <JoinAurexModal isOpen={joinModalOpen} onClose={() => setJoinModalOpen(false)} />
    </>
  );
}
