import { apiFetch } from "@/lib/api/client";

/**
 * The investor's Transaction History: the money-in side (GET /investments)
 * and the money-out side (GET /payouts) merged into one chronological list.
 * Same convention as the rest of lib/: the API's snake_case rows are mapped
 * to camelCase here so no component ever touches a raw row.
 */

export type TransactionKind = "investment" | "payout";

export type InvestmentStatus = "pending_payment" | "active" | "matured";
export type PayoutStatus = "scheduled" | "paid" | "missed" | "late";
export type TransactionStatus = InvestmentStatus | PayoutStatus;

export const TRANSACTION_STATUS_LABEL: Record<TransactionStatus, string> = {
  pending_payment: "Pending Payment",
  active: "Active",
  matured: "Matured",
  scheduled: "Scheduled",
  paid: "Paid",
  missed: "Missed",
  late: "Late",
};

export const TRANSACTION_KIND_LABEL: Record<TransactionKind, string> = {
  investment: "Investment",
  payout: "Payout",
};

export type Transaction = {
  /** Prefixed with the kind, since an investment's and a payout's ids come
   *  from two different tables and could otherwise collide. */
  id: string;
  kind: TransactionKind;
  /** Package name, or the business's name for a Ventures investment. */
  title: string;
  packageType: "core" | "ventures" | null;
  status: TransactionStatus;
  /** ISO date this entry is placed at: an investment's start date, a payout's
   *  paid date (or its scheduled date while still unpaid). */
  date: string;
  /** Money in (investment) or out (payout) — the amount actually moved, or
   *  for a not-yet-paid payout the scheduled amount. */
  amountGhs: number;
  // Investment-only detail
  currentValueGhs?: number;
  earningsGhs?: number;
  ratePercentLabel?: string;
  maturityDate?: string | null;
  // Payout-only detail
  scheduledAmountGhs?: number;
  paidAmountGhs?: number | null;
  scheduledDate?: string;
  paidDate?: string | null;
  seasonId?: string | null;
  investmentId?: string | null;
};

type InvestmentApiRow = {
  id: string;
  package_type: "core" | "ventures";
  package_name: string;
  business_name: string | null;
  amount_invested: string;
  current_value: string;
  roi_rate: string;
  start_date: string | null;
  maturity_date: string | null;
  created_at?: string;
  status: InvestmentStatus;
};

type PayoutApiRow = {
  id: string;
  investment_id: string | null;
  season_id: string | null;
  package_name?: string | null;
  package_type?: "core" | "ventures" | null;
  business_name?: string | null;
  scheduled_amount: string;
  paid_amount: string | null;
  scheduled_date: string;
  paid_date: string | null;
  status: PayoutStatus;
};

function toInvestmentTransaction(row: InvestmentApiRow): Transaction {
  const invested = Number(row.amount_invested);
  const currentValue = Number(row.current_value);
  return {
    id: `investment-${row.id}`,
    kind: "investment",
    title: row.business_name ?? row.package_name,
    packageType: row.package_type,
    status: row.status,
    date: row.start_date ?? row.created_at ?? "",
    amountGhs: invested,
    currentValueGhs: currentValue,
    earningsGhs: currentValue - invested,
    ratePercentLabel: `${Number(row.roi_rate)}% p.a.`,
    maturityDate: row.maturity_date,
  };
}

function toPayoutTransaction(row: PayoutApiRow, investments: Map<string, InvestmentApiRow>): Transaction {
  // The payout row may not carry the package/business itself — fall back to
  // the investment it belongs to.
  const parent = row.investment_id ? investments.get(row.investment_id) : undefined;
  const scheduledAmount = Number(row.scheduled_amount);
  const paidAmount = row.paid_amount === null ? null : Number(row.paid_amount);
  return {
    id: `payout-${row.id}`,
    kind: "payout",
    title: row.business_name ?? row.package_name ?? parent?.business_name ?? parent?.package_name ?? "Payout",
    packageType: row.package_type ?? parent?.package_type ?? null,
    status: row.status,
    date: row.paid_date ?? row.scheduled_date,
    amountGhs: paidAmount ?? scheduledAmount,
    scheduledAmountGhs: scheduledAmount,
    paidAmountGhs: paidAmount,
    scheduledDate: row.scheduled_date,
    paidDate: row.paid_date,
    seasonId: row.season_id,
    investmentId: row.investment_id,
  };
}

/** Throws on failure (unlike most of lib/) so the page can show a retry
 *  state — an empty list would be indistinguishable from "no transactions". */
export async function getMyTransactions(userId: string): Promise<Transaction[]> {
  const [investmentsRes, payoutsRes] = await Promise.all([
    apiFetch<InvestmentApiRow[]>(`/investments?user_id=${encodeURIComponent(userId)}`),
    apiFetch<PayoutApiRow[]>("/payouts"),
  ]);

  const investmentsById = new Map(investmentsRes.data.map((row) => [row.id, row]));

  return [
    ...investmentsRes.data.map(toInvestmentTransaction),
    ...payoutsRes.data.map((row) => toPayoutTransaction(row, investmentsById)),
  ];
}
