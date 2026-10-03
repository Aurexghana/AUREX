"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { hoverScale } from "@/lib/motion";
import { formatDisplayDate } from "@/lib/formatters";
import { FormField, fieldClassName } from "@/components/apply/FormField";
import CustomSelect from "@/components/apply/CustomSelect";
import {
  TRANSACTION_KIND_LABEL,
  TRANSACTION_STATUS_LABEL,
  type Transaction,
  type TransactionKind,
  type TransactionStatus,
} from "@/lib/transactions";

type KindFilter = "all" | TransactionKind;
type SortOrder = "newest" | "oldest";

const PAGE_SIZE = 10;

const KIND_FILTERS: { value: KindFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "investment", label: "Investments" },
  { value: "payout", label: "Payouts" },
];

const INVESTMENT_STATUSES: TransactionStatus[] = ["pending_payment", "active", "matured"];
const PAYOUT_STATUSES: TransactionStatus[] = ["scheduled", "paid", "late", "missed"];

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

// Same "gold = in progress, green = good outcome, red = problem, neutral
// otherwise" convention the Report and Listing status badges use.
const STATUS_TONE: Record<TransactionStatus, string> = {
  pending_payment: "border-grid-line text-cream-dim",
  active: "border-gold/30 text-gold-bright",
  matured: "border-grid-line text-cream-dim",
  scheduled: "border-grid-line text-cream-dim",
  paid: "border-[#4ade80]/30 text-[#4ade80]",
  late: "border-gold/30 text-gold-bright",
  missed: "border-[#f87171]/30 text-[#f87171]",
};

/** Whole cedis when the amount is whole, otherwise two decimals — payouts
 *  can be fractional, which formatGhs (whole numbers only) would round. */
function formatAmount(amount: number): string {
  return `GHS ${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string | null | undefined): string {
  return iso ? formatDisplayDate(iso) : "—";
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center rounded-full border px-2.5 py-0.5 font-jakarta text-[10px] font-medium uppercase tracking-wide ${STATUS_TONE[status]}`}
    >
      {TRANSACTION_STATUS_LABEL[status]}
    </span>
  );
}

function KindBadge({ kind }: { kind: TransactionKind }) {
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center rounded-full border px-2 py-0.5 font-jakarta text-[10px] font-medium uppercase tracking-wide ${
        kind === "investment" ? "border-gold/30 text-gold-bright" : "border-grid-line text-cream-dim"
      }`}
    >
      {TRANSACTION_KIND_LABEL[kind]}
    </span>
  );
}

function detailLine(t: Transaction): string {
  if (t.kind === "investment") {
    return [
      t.ratePercentLabel,
      t.maturityDate ? `Matures ${formatDate(t.maturityDate)}` : null,
      t.status !== "pending_payment" && t.earningsGhs !== undefined
        ? `Earnings ${formatAmount(t.earningsGhs)}`
        : null,
    ]
      .filter(Boolean)
      .join(" · ");
  }

  return [
    t.seasonId ? `Season ${t.seasonId.slice(0, 8).toUpperCase()}` : null,
    t.paidDate && t.scheduledDate && t.paidDate.slice(0, 10) !== t.scheduledDate.slice(0, 10)
      ? `Scheduled ${formatDate(t.scheduledDate)}`
      : null,
    t.paidAmountGhs != null && t.scheduledAmountGhs !== undefined && t.paidAmountGhs !== t.scheduledAmountGhs
      ? `Expected ${formatAmount(t.scheduledAmountGhs)}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-sans text-xs uppercase tracking-wide text-cream-dim">{label}</span>
      <span className="font-jakarta text-2xl font-bold text-cream sm:text-3xl">{value}</span>
    </div>
  );
}

/**
 * The Investor Dashboard's Transaction History — reached from the Earnings
 * tab's "Transaction History" link. Money in (investments) and money out
 * (payouts) in one list, filterable by type, status and date range.
 *
 * The summary figures follow the active filters, so narrowing the list to
 * e.g. "Payouts, this year" also answers "how much was I paid this year".
 * Dates compare as YYYY-MM-DD strings rather than Date objects, so a
 * timestamp near midnight can't slip across a day boundary by timezone.
 */
export default function TransactionHistory({ transactions }: { transactions: Transaction[] }) {
  const [kind, setKind] = useState<KindFilter>("all");
  const [status, setStatus] = useState<"all" | TransactionStatus>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<SortOrder>("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const statusChoices =
    kind === "investment"
      ? INVESTMENT_STATUSES
      : kind === "payout"
        ? PAYOUT_STATUSES
        : [...INVESTMENT_STATUSES, ...PAYOUT_STATUSES.filter((s) => !INVESTMENT_STATUSES.includes(s))];
  // A status picked under one type filter may not exist under another.
  const effectiveStatus = status !== "all" && statusChoices.includes(status) ? status : "all";

  const filtered = transactions
    .filter((t) => kind === "all" || t.kind === kind)
    .filter((t) => effectiveStatus === "all" || t.status === effectiveStatus)
    .filter((t) => !from || t.date.slice(0, 10) >= from)
    .filter((t) => !to || t.date.slice(0, 10) <= to)
    .sort((a, b) => (sort === "newest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const totalIn = filtered.filter((t) => t.kind === "investment").reduce((sum, t) => sum + t.amountGhs, 0);
  const totalOut = filtered
    .filter((t) => t.kind === "payout" && t.paidAmountGhs != null)
    .reduce((sum, t) => sum + (t.paidAmountGhs ?? 0), 0);

  const hasActiveFilters = kind !== "all" || effectiveStatus !== "all" || from !== "" || to !== "";

  const clearFilters = () => {
    setKind("all");
    setStatus("all");
    setFrom("");
    setTo("");
    setVisibleCount(PAGE_SIZE);
  };

  // Every filter change also restarts pagination at the first page.
  const withReset = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">Transaction History</h2>
        <p className="font-sans text-sm text-cream-dim">
          Every investment you&apos;ve made and every payout AUREX has scheduled or paid to you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 border border-grid-line bg-panel/20 p-6 sm:grid-cols-2 sm:p-8">
        <SummaryStat label="Invested · in view" value={formatAmount(totalIn)} />
        <SummaryStat label="Paid out · in view" value={formatAmount(totalOut)} />
      </div>

      <div className="flex flex-col gap-4 border border-gold/20 bg-panel/40 p-5 backdrop-blur-2xl sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 border border-grid-line p-1" role="group" aria-label="Transaction type">
            {KIND_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => withReset(setKind)(f.value)}
                aria-pressed={kind === f.value}
                className={`px-3.5 py-1.5 font-jakarta text-sm font-medium transition-colors ${
                  kind === f.value ? "bg-gold-bright text-amainblack" : "text-cream-dim hover:text-cream"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="font-jakarta text-sm font-medium text-gold-bright underline-offset-4 transition-colors hover:text-gold-light hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FormField label="Status" htmlFor="tx-status">
            <CustomSelect
              id="tx-status"
              value={effectiveStatus}
              onChange={(v) => withReset(setStatus)(v as "all" | TransactionStatus)}
              options={[
                { value: "all", label: "All statuses" },
                ...statusChoices.map((s) => ({ value: s, label: TRANSACTION_STATUS_LABEL[s] })),
              ]}
              triggerClassName="w-full"
            />
          </FormField>

          <FormField label="From" htmlFor="tx-from">
            <input
              id="tx-from"
              type="date"
              value={from}
              max={to || undefined}
              onChange={(e) => withReset(setFrom)(e.target.value)}
              className={fieldClassName(false, "w-full")}
            />
          </FormField>

          <FormField label="To" htmlFor="tx-to">
            <input
              id="tx-to"
              type="date"
              value={to}
              min={from || undefined}
              onChange={(e) => withReset(setTo)(e.target.value)}
              className={fieldClassName(false, "w-full")}
            />
          </FormField>

          <FormField label="Sort" htmlFor="tx-sort">
            <CustomSelect
              id="tx-sort"
              value={sort}
              onChange={(v) => setSort(v as SortOrder)}
              options={SORT_OPTIONS}
              triggerClassName="w-full"
            />
          </FormField>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-6">
          <div className="overflow-x-auto border border-grid-line bg-panel/20">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-grid-line">
                  {["Date", "Transaction", "Amount", "Status"].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className={`px-4 py-3 font-sans text-[11px] font-medium uppercase tracking-wide text-cream-dim ${
                        heading === "Amount" ? "text-right" : ""
                      }`}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((t) => {
                  const detail = detailLine(t);
                  return (
                    <tr key={t.id} className="border-b border-grid-line last:border-b-0">
                      <td className="whitespace-nowrap px-4 py-4 align-top font-sans text-sm text-cream-dim">
                        {formatDate(t.date)}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-jakarta text-sm font-semibold text-cream">{t.title}</span>
                            <KindBadge kind={t.kind} />
                          </div>
                          {detail && <span className="font-sans text-xs text-cream-dim">{detail}</span>}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right align-top font-jakarta text-sm font-semibold text-cream">
                        {formatAmount(t.amountGhs)}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <StatusBadge status={t.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className="font-sans text-xs text-cream-dim">
              Showing {visible.length} of {filtered.length}
            </p>
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
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 border border-grid-line py-12 text-center">
          <p className="font-jakarta text-sm font-medium text-cream">
            {transactions.length === 0 ? "No transactions yet." : "No transactions match these filters."}
          </p>
          <p className="max-w-sm font-sans text-sm text-cream-dim">
            {transactions.length === 0
              ? "Your investments and payouts will show up here once Admin records them."
              : "Try a different type, status or date range."}
          </p>
          {transactions.length > 0 && hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-1 font-jakarta text-sm font-medium text-gold-bright underline-offset-4 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </section>
  );
}
