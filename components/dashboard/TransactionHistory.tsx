"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { hoverScale } from "@/lib/motion";
import { formatDisplayDate } from "@/lib/formatters";
import { FormField, fieldClassName } from "@/components/apply/FormField";
import CustomSelect from "@/components/apply/CustomSelect";
import {
  PAYOUT_STATUS_LABEL,
  displayStatus,
  getMyPayouts,
  getSeasons,
  type Payout,
  type PayoutStatus,
  type Season,
} from "@/lib/transactions";

const PAGE_SIZE = 10;

const STATUS_OPTIONS: { value: "all" | PayoutStatus; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "scheduled", label: PAYOUT_STATUS_LABEL.scheduled },
  { value: "late", label: PAYOUT_STATUS_LABEL.late },
  { value: "paid", label: PAYOUT_STATUS_LABEL.paid },
  { value: "missed", label: PAYOUT_STATUS_LABEL.missed },
];

type ViewMode = "all" | "firstPending";

const VIEW_OPTIONS: { value: ViewMode; label: string }[] = [
  { value: "all", label: "All payouts" },
  { value: "firstPending", label: "Next payout only" },
];

const STATUS_TONE: Record<PayoutStatus, string> = {
  scheduled: "border-grid-line text-cream-dim",
  paid: "border-[#4ade80]/30 text-[#4ade80]",
  late: "border-gold/30 text-gold-bright",
  missed: "border-[#f87171]/30 text-[#f87171]",
};

type LoadedPayouts = {
  key: string;
  rows: Payout[];
  page: number;
  totalPages: number;
  total: number;
  error: boolean;
};

function formatAmount(amount: number): string {
  return `GHS ${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string | null | undefined): string {
  return iso ? formatDisplayDate(iso) : "—";
}

function StatusBadge({ status }: { status: PayoutStatus }) {
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center rounded-full border px-2.5 py-0.5 font-jakarta text-[10px] font-medium uppercase tracking-wide ${STATUS_TONE[status]}`}
    >
      {PAYOUT_STATUS_LABEL[status]}
    </span>
  );
}

function detailLine(payout: Payout, seasonName: string | undefined): string {
  return [
    seasonName ?? null,
    payout.paidDate ? `Paid ${formatDate(payout.paidDate)}` : null,
    payout.paidAmountGhs !== null && payout.paidAmountGhs !== payout.scheduledAmountGhs
      ? `Expected ${formatAmount(payout.scheduledAmountGhs)}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

type FilterValues = {
  status: "all" | PayoutStatus;
  seasonId: string;
  viewMode: ViewMode;
  from: string;
  to: string;
  packageQuery: string;
};

const DEFAULT_FILTERS: FilterValues = {
  status: "all",
  seasonId: "all",
  viewMode: "firstPending",
  from: "",
  to: "",
  packageQuery: "",
};

/** The six filter inputs, shared by the desktop panel (live values) and the
 *  mobile modal (a draft that only applies on "Apply"). */
function FilterFields({
  idPrefix,
  values,
  onChange,
  seasons,
  className,
}: {
  idPrefix: string;
  values: FilterValues;
  onChange: (patch: Partial<FilterValues>) => void;
  seasons: Season[];
  className: string;
}) {
  const isViewLocked = values.status !== "all" && values.status !== "scheduled";
  const viewMode: ViewMode = isViewLocked ? "all" : values.viewMode;

  return (
    <div className={className}>
      <FormField label="Status" htmlFor={`${idPrefix}-status`}>
        <CustomSelect
          id={`${idPrefix}-status`}
          value={values.status}
          onChange={(v) => onChange({ status: v as "all" | PayoutStatus })}
          options={STATUS_OPTIONS}
          triggerClassName="w-full"
        />
      </FormField>

      {seasons.length > 0 && (
        <FormField label="Season" htmlFor={`${idPrefix}-season`}>
          <CustomSelect
            id={`${idPrefix}-season`}
            value={values.seasonId}
            onChange={(v) => onChange({ seasonId: v })}
            options={[{ value: "all", label: "All seasons" }, ...seasons.map((s) => ({ value: s.id, label: s.name }))]}
            triggerClassName="w-full"
          />
        </FormField>
      )}

      <FormField label="Show" htmlFor={`${idPrefix}-view`}>
        <CustomSelect
          id={`${idPrefix}-view`}
          value={viewMode}
          disabled={isViewLocked}
          onChange={(v) => onChange({ viewMode: v as ViewMode })}
          options={VIEW_OPTIONS}
          triggerClassName="w-full"
        />
      </FormField>

      <FormField label="Package" htmlFor={`${idPrefix}-package`}>
        <input
          id={`${idPrefix}-package`}
          type="text"
          value={values.packageQuery}
          onChange={(e) => onChange({ packageQuery: e.target.value })}
          placeholder="e.g. spoty"
          className={fieldClassName(false, "w-full")}
        />
      </FormField>

      <FormField label="From" htmlFor={`${idPrefix}-from`}>
        <input
          id={`${idPrefix}-from`}
          type="date"
          value={values.from}
          max={values.to || undefined}
          onChange={(e) => onChange({ from: e.target.value })}
          className={fieldClassName(false, "w-full")}
        />
      </FormField>

      <FormField label="To" htmlFor={`${idPrefix}-to`}>
        <input
          id={`${idPrefix}-to`}
          type="date"
          value={values.to}
          min={values.from || undefined}
          onChange={(e) => onChange({ to: e.target.value })}
          className={fieldClassName(false, "w-full")}
        />
      </FormField>
    </div>
  );
}

/**
 * The Investor Dashboard's payout history (the Transactions
 * tab). Same filters as the admin Payouts page (status,
 * season, date range, package), minus the member search since the API already
 * scopes every row to the signed-in investor. Filtering and paging happen
 * server-side; "Load More" appends the next page.
 */
export default function TransactionHistory() {
  const [status, setStatus] = useState<"all" | PayoutStatus>("all");
  const [seasonId, setSeasonId] = useState("all");
  const [pickedViewMode, setViewMode] = useState<ViewMode>("firstPending");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [packageQuery, setPackageQuery] = useState("");
  const [debouncedPackage, setDebouncedPackage] = useState("");
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loaded, setLoaded] = useState<LoadedPayouts | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draft, setDraft] = useState<FilterValues>(DEFAULT_FILTERS);

  useEffect(() => {
    let cancelled = false;
    getSeasons().then((rows) => {
      if (!cancelled) setSeasons(rows);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedPackage(packageQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [packageQuery]);

  const isViewLocked = status !== "all" && status !== "scheduled";
  const viewMode: ViewMode = isViewLocked ? "all" : pickedViewMode;

  const queryKey = [status, seasonId, viewMode, from, to, debouncedPackage, attempt].join("|");

  function currentFilters(page: number) {
    return {
      status: status === "all" ? undefined : status,
      seasonId: seasonId === "all" ? undefined : seasonId,
      startDate: from || undefined,
      endDate: to || undefined,
      packageQuery: debouncedPackage || undefined,
      firstPendingOnly: viewMode === "firstPending",
      page,
      limit: PAGE_SIZE,
    };
  }

  useEffect(() => {
    let cancelled = false;
    getMyPayouts(currentFilters(1))
      .then((result) => {
        if (cancelled) return;
        setLoadMoreFailed(false);
        setLoaded({
          key: queryKey,
          rows: result.data,
          page: result.page,
          totalPages: result.totalPages,
          total: result.total,
          error: false,
        });
      })
      .catch(() => {
        if (!cancelled) setLoaded({ key: queryKey, rows: [], page: 1, totalPages: 1, total: 0, error: true });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, seasonId, viewMode, from, to, debouncedPackage, attempt]);

  const isLoading = loaded?.key !== queryKey;
  const hasActiveFilters = status !== "all" || seasonId !== "all" || viewMode !== "firstPending" || from !== "" || to !== "" || packageQuery.trim() !== "";
  const seasonNames = new Map(seasons.map((s) => [s.id, s.name]));

  const clearFilters = () => {
    setStatus("all");
    setSeasonId("all");
    setViewMode("firstPending");
    setFrom("");
    setTo("");
    setPackageQuery("");
    setDebouncedPackage("");
  };

  const liveFilters: FilterValues = { status, seasonId, viewMode, from, to, packageQuery };

  const applyFilters = (next: FilterValues) => {
    setStatus(next.status);
    setSeasonId(next.seasonId);
    setViewMode(next.viewMode);
    setFrom(next.from);
    setTo(next.to);
    setPackageQuery(next.packageQuery);
    setDebouncedPackage(next.packageQuery.trim());
  };

  const openFilters = () => {
    setDraft(liveFilters);
    setFiltersOpen(true);
  };

  useEffect(() => {
    if (!filtersOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFiltersOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [filtersOpen]);

  const loadMore = async () => {
    if (!loaded || loadingMore) return;
    setLoadingMore(true);
    setLoadMoreFailed(false);
    try {
      const result = await getMyPayouts(currentFilters(loaded.page + 1));
      setLoaded((prev) =>
        prev && prev.key === queryKey
          ? {
              ...prev,
              rows: [...prev.rows, ...result.data],
              page: result.page,
              totalPages: result.totalPages,
              total: result.total,
            }
          : prev,
      );
    } catch {
      setLoadMoreFailed(true);
    } finally {
      setLoadingMore(false);
    }
  };

  const hasMore = loaded !== null && !isLoading && loaded.page < loaded.totalPages;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">Transaction History</h2>
          <p className="font-sans text-sm text-cream-dim">Every payout AUREX has scheduled or paid to you.</p>
        </div>
        <button
          type="button"
          onClick={openFilters}
          aria-haspopup="dialog"
          className="relative flex shrink-0 items-center gap-2 border border-gold/30 px-3.5 py-2 font-jakarta text-sm font-medium text-gold-bright transition-colors hover:border-gold hover:bg-gold/5 md:hidden"
        >
          <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
            <path d="M3 5h14M6 10h8M9 15h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Filters
          {hasActiveFilters && <span className="size-2 rounded-full bg-gold-bright" aria-label="Filters applied" />}
        </button>
      </div>

      {/* Phones: just the result count (and a way to clear) - the filters
          themselves live in the modal the button above opens. */}
      <div className="flex items-center justify-between gap-3 md:hidden">
        <span className="font-sans text-xs text-cream-dim">
          {loaded && !isLoading && !loaded.error ? `${loaded.total} ${loaded.total === 1 ? "payout" : "payouts"}` : ""}
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="font-jakarta text-sm font-medium text-gold-bright underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="hidden flex-col gap-4 border border-gold/20 bg-panel/40 p-6 backdrop-blur-2xl md:flex">
        <FilterFields
          idPrefix="tx"
          values={liveFilters}
          onChange={(patch) => applyFilters({ ...liveFilters, ...patch })}
          seasons={seasons}
          className="grid gap-4 sm:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr lg:gap-3"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-sans text-xs text-cream-dim">
            {loaded && !isLoading && !loaded.error ? `${loaded.total} ${loaded.total === 1 ? "payout" : "payouts"}` : ""}
          </span>
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
      </div>

      {filtersOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 md:hidden"
          onClick={() => setFiltersOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tx-filters-title"
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full flex-col gap-5 overflow-y-auto border-t border-gold/20 bg-ink p-5 pb-6 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 id="tx-filters-title" className="font-jakarta text-lg font-semibold text-cream">
                Filters
              </h3>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setFiltersOpen(false)}
                className="flex size-8 items-center justify-center text-cream-dim transition-colors hover:text-gold-bright"
              >
                <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
                  <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <FilterFields
              idPrefix="txm"
              values={draft}
              onChange={(patch) => setDraft((d) => ({ ...d, ...patch }))}
              seasons={seasons}
              className="flex flex-col gap-4"
            />

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setDraft(DEFAULT_FILTERS)}
                className="flex-1 border border-grid-line px-4 py-3 font-jakarta text-sm font-medium text-cream transition-colors hover:border-gold/40"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  applyFilters(draft);
                  setFiltersOpen(false);
                }}
                className="flex-1 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-4 py-3 font-jakarta text-sm font-medium text-amainblack"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="px-4 py-10 text-center font-sans text-sm text-cream-dim">Loading…</p>
      ) : loaded.error ? (
        <div className="flex flex-col items-center gap-3 border border-[#f87171]/30 bg-[#f87171]/5 px-6 py-12 text-center">
          <p role="alert" className="font-sans text-sm text-[#f87171]">
            Something went wrong loading your payouts.
          </p>
          <button
            type="button"
            onClick={() => setAttempt((n) => n + 1)}
            className="font-jakarta text-sm font-medium text-gold-bright underline-offset-4 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : loaded.rows.length > 0 ? (
        <div className="flex flex-col gap-6">
          <div className="overflow-x-auto border border-grid-line bg-panel/20">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-grid-line">
                  {["Scheduled", "Package", "Amount", "Status"].map((heading) => (
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
                {loaded.rows.map((payout) => {
                  const detail = detailLine(payout, payout.seasonId ? seasonNames.get(payout.seasonId) : undefined);
                  return (
                    <tr key={payout.id} className="border-b border-grid-line last:border-b-0">
                      <td className="whitespace-nowrap px-4 py-4 align-top font-sans text-sm text-cream-dim">
                        {formatDate(payout.scheduledDate)}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-col gap-1">
                          <span className="font-jakarta text-sm font-semibold text-cream">
                            {payout.businessName ?? payout.packageName}
                          </span>
                          {detail && <span className="font-sans text-xs text-cream-dim">{detail}</span>}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right align-top font-jakarta text-sm font-semibold text-cream">
                        {formatAmount(payout.paidAmountGhs ?? payout.scheduledAmountGhs)}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <StatusBadge status={displayStatus(payout)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className="font-sans text-xs text-cream-dim">
              Showing {loaded.rows.length} of {loaded.total}
            </p>
            {loadMoreFailed && (
              <p role="alert" className="font-sans text-xs text-[#f87171]">
                Couldn&apos;t load more. Please try again.
              </p>
            )}
            {hasMore && (
              <motion.button
                {...hoverScale}
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="flex items-center justify-center border border-gold/30 px-6 py-3 font-jakarta text-sm font-medium text-gold-bright transition-colors hover:border-gold hover:bg-gold/5 disabled:opacity-60"
              >
                {loadingMore ? "Loading…" : "Load More"}
              </motion.button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 border border-grid-line px-6 py-12 text-center">
          <p className="font-jakarta text-sm font-medium text-cream">
            {hasActiveFilters ? "No payouts match these filters." : "No pending payouts."}
          </p>
          <p className="max-w-sm font-sans text-sm text-cream-dim">
            {hasActiveFilters
              ? "Try a different status, season, view, package or date range."
              : "Upcoming payouts will show up here once an investment of yours is active. Switch Show to All payouts to see past ones."}
          </p>
          {hasActiveFilters && (
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
