import type { BusinessListing, ListingStatus } from "@/lib/businessListing";
import { LISTING_STATUS_LABEL } from "@/lib/businessListing";

// Tone per status: gold for "actionable/in-progress" (live), the same
// green Leaderboard.tsx already uses for a positive change (funded - a
// distinct, good outcome from just "still open"), and a plain neutral
// treatment for pending/closed, since neither is something to celebrate
// or act on right now.
const STATUS_TONE: Record<ListingStatus, string> = {
  pending: "border-grid-line text-cream-dim",
  live: "border-gold/30 text-gold-bright",
  funded: "border-[#4ade80]/30 text-[#4ade80]",
  closed: "border-grid-line text-cream-dim",
};

/**
 * Always the first thing on the dashboard - this single badge is the
 * answer to "how's my listing doing" at a glance. Only the pending state
 * gets its own explanatory copy here; live/funded/closed instead get the
 * full Funding Progress + Listing Details sections below (see
 * BusinessOwnerDashboard's own comment on why pending is isolated).
 */
export default function ListingStatusSection({ listing }: { listing: BusinessListing }) {
  return (
    <section className="flex flex-col gap-4 border border-gold/20 bg-panel/40 p-6 backdrop-blur-2xl sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-jakarta text-lg font-semibold text-cream sm:text-xl">Listing Status</h2>
        <span
          className={`inline-flex w-fit items-center rounded-full border px-3 py-1 font-jakarta text-xs font-medium uppercase tracking-wide ${STATUS_TONE[listing.status]}`}
        >
          {LISTING_STATUS_LABEL[listing.status]}
        </span>
      </div>

      {listing.status === "pending" && (
        <p className="font-sans text-sm text-cream-dim sm:text-base">
          AUREX Admin is still reviewing your listing before it goes live. There&apos;s no funding activity to show
          yet; check back soon.
        </p>
      )}
    </section>
  );
}
