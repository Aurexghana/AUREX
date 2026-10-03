import { apiFetch, apiFetchPaginated } from "@/lib/api/client";

export type PayoutStatus = "scheduled" | "paid" | "missed" | "late";

export const PAYOUT_STATUS_LABEL: Record<PayoutStatus, string> = {
  scheduled: "Scheduled",
  paid: "Paid",
  late: "Late",
  missed: "Missed",
};

export type Payout = {
  id: string;
  investmentId: string;
  packageName: string;
  businessName: string | null;
  scheduledAmountGhs: number;
  paidAmountGhs: number | null;
  scheduledDate: string;
  paidDate: string | null;
  status: PayoutStatus;
  seasonId: string | null;
};

export type Season = {
  id: string;
  name: string;
};

export type PayoutFilters = {
  status?: PayoutStatus;
  seasonId?: string;
  startDate?: string;
  endDate?: string;
  packageQuery?: string;
  firstPendingOnly?: boolean;
  page: number;
  limit: number;
};

export type PayoutPage = {
  data: Payout[];
  page: number;
  totalPages: number;
  total: number;
};

type PayoutApiRow = {
  id: string;
  investment_id: string;
  package_name: string;
  business_name: string | null;
  amount: string;
  paid_amount: string | null;
  scheduled_date: string;
  paid_date: string | null;
  status: PayoutStatus;
  season_id: string | null;
};

type SeasonApiRow = {
  id: string;
  name: string;
};

function toPayout(row: PayoutApiRow): Payout {
  return {
    id: row.id,
    investmentId: row.investment_id,
    packageName: row.package_name,
    businessName: row.business_name,
    scheduledAmountGhs: Number(row.amount),
    paidAmountGhs: row.paid_amount === null ? null : Number(row.paid_amount),
    scheduledDate: row.scheduled_date,
    paidDate: row.paid_date,
    status: row.status,
    seasonId: row.season_id,
  };
}

/** "Late" is never stored — it's a still-scheduled payout whose date has passed. */
export function displayStatus(payout: Payout): PayoutStatus {
  const isLate = payout.status === "scheduled" && payout.scheduledDate.slice(0, 10) < new Date().toISOString().slice(0, 10);
  return isLate ? "late" : payout.status;
}

/** Throws on failure (unlike most of lib/) so the page can show a retry
 *  state — an empty list would be indistinguishable from "no payouts". */
export async function getMyPayouts(filters: PayoutFilters): Promise<PayoutPage> {
  const params = new URLSearchParams({ page: String(filters.page), limit: String(filters.limit) });
  if (filters.status) params.set("status", filters.status);
  if (filters.seasonId) params.set("season_id", filters.seasonId);
  if (filters.startDate) params.set("start_date", filters.startDate);
  if (filters.endDate) params.set("end_date", filters.endDate);
  if (filters.packageQuery) params.set("package", filters.packageQuery);
  if (filters.firstPendingOnly) params.set("first_pending_only", "true");

  const { data, pagination } = await apiFetchPaginated<PayoutApiRow>(`/payouts?${params.toString()}`);
  return {
    data: data.map(toPayout),
    page: pagination.page,
    totalPages: pagination.totalPages,
    total: pagination.total,
  };
}

export async function getSeasons(): Promise<Season[]> {
  try {
    const { data } = await apiFetch<SeasonApiRow[]>("/seasons");
    return data.map((row) => ({ id: row.id, name: row.name }));
  } catch {
    return [];
  }
}
