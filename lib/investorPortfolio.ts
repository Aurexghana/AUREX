import { apiFetch } from "@/lib/api/client";

export type InvestorProfile = {
  nickname: string;
  /** The account's real name — kept separate from `nickname` since the
   *  leaderboard/dashboard header only ever show the nickname, but a few
   *  Admin-facing surfaces (the Report tab's read-only identity block,
   *  see components/dashboard/ReportSection.tsx) need the real name too. */
  realName: string;
};

export const MOCK_INVESTOR: InvestorProfile = {
  nickname: "GoldFalcon",
  realName: "Kwame Mensah",
};

export type HoldingPackage = "core" | "ventures";
export type HoldingStatus = "active" | "matured";

export type InvestmentHolding = {
  id: string;
  package: HoldingPackage;
  packageName: string;
  /** Only set for Ventures holdings, same reasoning as
   *  InvestmentSlot.businessName in lib/investmentSlots.ts. */
  businessName?: string;
  amountInvestedGhs: number;
  ratePercentLabel: string;
  earningsToDateGhs: number;
  lastUpdated: string;
  status: HoldingStatus;
};

type InvestmentApiRow = {
  id: string;
  package_type: HoldingPackage;
  package_name: string;
  business_name: string | null;
  amount_invested: string;
  current_value: string;
  roi_rate: string;
  updated_at: string;
  status: "pending_payment" | "active" | "matured";
};

function toInvestmentHolding(row: InvestmentApiRow): InvestmentHolding {
  return {
    id: row.id,
    package: row.package_type,
    packageName: row.package_name,
    businessName: row.business_name ?? undefined,
    amountInvestedGhs: Number(row.amount_invested),
    ratePercentLabel: `${Number(row.roi_rate)}% p.a.`,
    earningsToDateGhs: Number(row.current_value) - Number(row.amount_invested),
    lastUpdated: row.updated_at.slice(0, 10),
    status: row.status === "matured" ? "matured" : "active",
  };
}

export async function getMyHoldings(): Promise<InvestmentHolding[]> {
  try {
    const { data } = await apiFetch<InvestmentApiRow[]>("/investments");
    return data.map(toInvestmentHolding);
  } catch {
    return [];
  }
}
