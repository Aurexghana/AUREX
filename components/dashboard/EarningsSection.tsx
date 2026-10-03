import Link from "next/link";
import { formatGhs } from "@/lib/formatters";
import HoldingRow from "@/components/dashboard/HoldingRow";
import type { InvestmentHolding } from "@/lib/investorPortfolio";

/**
 * A trust surface, not a marketing one - per the brief this section should
 * feel calm and factual, so unlike OpenSlotsSection it gets no hover
 * lifts, no gradient CTAs, no filter tabs, just plain figures. Every
 * number here (including the running total below) is a sum of figures
 * Admin already typed in; nothing is calculated the way real interest
 * would be, since there's no live payment data yet to calculate from.
 */
export default function EarningsSection({ holdings }: { holdings: InvestmentHolding[] }) {
  // "Running total across all active investments" per the brief - matured
  // holdings still get their own row below (with their own recorded
  // earnings), they just aren't folded into this headline figure.
  const activeHoldings = holdings.filter((h) => h.status === "active");
  const totalActiveEarnings = activeHoldings.reduce((sum, h) => sum + h.earningsToDateGhs, 0);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">My Earnings</h2>
        <p className="font-sans text-sm text-cream-dim">
          Figures below are recorded by AUREX Admin and updated as investments progress.
        </p>
      </div>

      <div className="flex flex-col gap-8 border border-grid-line bg-panel/20 p-6 sm:p-8">
        <div className="flex flex-col gap-1">
          <span className="font-sans text-xs uppercase tracking-wide text-cream-dim">
            Total Earnings · Active Investments
          </span>
          <span className="font-jakarta text-3xl font-bold text-cream sm:text-4xl">
            {formatGhs(totalActiveEarnings)}
          </span>
        </div>

        {holdings.length > 0 ? (
          <div className="flex flex-col border-t border-grid-line pt-2">
            {holdings.map((holding) => (
              <HoldingRow key={holding.id} holding={holding} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 border-t border-grid-line pt-8 text-center">
            <p className="font-jakarta text-sm font-medium text-cream">You don&apos;t have any recorded investments yet.</p>
            <p className="max-w-sm font-sans text-sm text-cream-dim">
              Once you invest in one of the open slots above, Admin will add it here so you can track it.
            </p>
            <Link
              href="/dashboard/investment"
              className="mt-1 font-jakarta text-sm font-medium text-gold-bright underline-offset-4 transition-colors hover:text-gold-light hover:underline"
            >
              View Open Investment Slots
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
