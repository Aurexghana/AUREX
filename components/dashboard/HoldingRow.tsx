import { formatGhs, formatDisplayDate } from "@/lib/formatters";
import type { InvestmentHolding } from "@/lib/investorPortfolio";

function StatusBadge({ status }: { status: InvestmentHolding["status"] }) {
  const isActive = status === "active";
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 font-jakarta text-[10px] font-medium uppercase tracking-wide ${
        isActive ? "border-gold/30 text-gold-bright" : "border-grid-line text-cream-dim"
      }`}
    >
      {isActive ? "Active" : "Matured"}
    </span>
  );
}

function Stat({ label, value, emphasize = false }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-sans text-[11px] uppercase tracking-wide text-cream-dim">{label}</span>
      <span className={`font-jakarta text-sm font-medium ${emphasize ? "text-gold-bright" : "text-cream"}`}>
        {value}
      </span>
    </div>
  );
}

/**
 * One row of the "My Earnings" per-investment breakdown. Doubles as the
 * "My Investments" status view per the brief's own suggestion to combine
 * the two rather than duplicate a near-identical list - each row already
 * shows this holding's status (active/matured) alongside its figures.
 *
 * Every figure here is exactly what Admin last recorded for this holding
 * (see lib/investorPortfolio.ts) - this row does no math of its own
 * beyond picking a display label.
 */
export default function HoldingRow({ holding }: { holding: InvestmentHolding }) {
  const title = holding.businessName ?? holding.packageName;

  return (
    <div className="flex flex-col gap-4 border-b border-grid-line py-5 first:pt-0 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-jakarta text-sm font-semibold text-cream sm:text-base">{title}</span>
          <StatusBadge status={holding.status} />
        </div>
        <span className="font-sans text-xs text-cream-dim">
          Last updated {formatDisplayDate(holding.lastUpdated)}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6 sm:flex sm:shrink-0 sm:gap-10">
        <Stat label="Invested" value={formatGhs(holding.amountInvestedGhs)} />
        <Stat label="Rate" value={holding.ratePercentLabel} />
        <Stat label="Earnings" value={formatGhs(holding.earningsToDateGhs)} emphasize />
      </div>
    </div>
  );
}
