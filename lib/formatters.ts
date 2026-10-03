/**
 * Tiny display-formatting helpers shared across the Investor Dashboard
 * (lib/investmentSlots.ts, lib/investorPortfolio.ts, and the
 * components/dashboard/ tree). Deliberately just formatting, not
 * calculation - every number/date passed in here is already the real
 * figure (an amount, a rate, a date Admin recorded); nothing here derives
 * a new value from other values. See the "IMPORTANT DATA NOTE" in the
 * dashboard components for why that distinction matters.
 */

/** e.g. 12000 -> "GHS 12,000". Whole-number amounts only - every mock
 *  figure in this dashboard is a round number, matching how Admin would
 *  actually type one in. */
export function formatGhs(amount: number): string {
  return `GHS ${Math.round(amount).toLocaleString("en-US")}`;
}

/** e.g. "2026-03-30" -> "30 Mar 2026", matching the brief's own example
 *  ("Open until 30 Mar 2026"). */
export function formatDisplayDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
