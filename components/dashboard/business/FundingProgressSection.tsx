import { formatGhs } from "@/lib/formatters";
import { getFundingPercent, type BusinessListing } from "@/lib/businessListing";

/**
 * The visual focal point of this dashboard per the brief - large numbers,
 * a progress bar, nothing else competing for attention. Only rendered for
 * live/funded/closed listings (see BusinessOwnerDashboard).
 *
 * Every number here is something Admin recorded after the fact (see
 * lib/businessListing.ts's own comment); the only thing computed on the
 * fly is the percentage itself, purely to size the bar.
 *
 * Deliberately never lists who backed this business, only a count - a
 * business owner doesn't get visibility into individual investors any
 * more than an investor gets visibility into other investors' identities
 * elsewhere on the platform.
 */
export default function FundingProgressSection({ listing }: { listing: BusinessListing }) {
  const percent = getFundingPercent(listing);
  const isFunded = listing.status === "funded";
  const isClosed = listing.status === "closed";
  const isEnded = isFunded || isClosed;

  return (
    <section className="flex flex-col gap-6 border border-grid-line bg-panel/20 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">Funding Progress</h2>
        {isFunded && (
          <span className="inline-flex w-fit items-center rounded-full border border-[#4ade80]/30 px-3 py-1 font-jakarta text-xs font-medium uppercase tracking-wide text-[#4ade80]">
            Fully Funded
          </span>
        )}
        {isClosed && (
          <span className="inline-flex w-fit items-center rounded-full border border-grid-line px-3 py-1 font-jakarta text-xs font-medium uppercase tracking-wide text-cream-dim">
            Round Closed
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <span className="font-jakarta text-3xl font-bold text-cream sm:text-4xl">
            {formatGhs(listing.amountRaisedGhs)}
          </span>
          <span className="font-sans text-sm text-cream-dim">raised of {formatGhs(listing.fundingGoalGhs)} goal</span>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-grid-line">
          <div
            className={`h-full rounded-full ${
              isFunded ? "bg-[#4ade80]" : isClosed ? "bg-graphite" : "bg-gradient-to-r from-gold via-gold-light to-gold-bright"
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>

        <span className="font-sans text-xs text-cream-dim">
          {percent}% of goal{isEnded ? " reached" : ""}
        </span>
      </div>

      <div className="flex items-baseline gap-2 border-t border-grid-line pt-5">
        <span className="font-jakarta text-lg font-semibold text-cream">{listing.backerCount}</span>
        <span className="font-sans text-sm text-cream-dim">
          {listing.backerCount === 1 ? "investor has" : "investors have"} backed this business
        </span>
      </div>
    </section>
  );
}
