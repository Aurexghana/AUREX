import { apiFetch } from "@/lib/api/client";
import type { InvestmentSlot, SlotPackage } from "@/lib/investmentSlots";

type PackageApiRow = {
  id: string;
  name: string;
  package_type: SlotPackage;
  business_name: string | null;
  min_investment: string;
  term_length: number;
  roi_rate: string;
  opens_at: string | null;
  closes_at: string | null;
  status: "active" | "closed" | "funded";
};

function toInvestmentSlot(row: PackageApiRow): InvestmentSlot {
  return {
    id: row.id,
    name: row.name,
    package: row.package_type,
    businessName: row.business_name ?? undefined,
    minInvestmentGhs: Number(row.min_investment),
    termLabel: `${row.term_length}-month term`,
    opensAt: row.opens_at ?? "",
    closesAt: row.closes_at ?? "",
    ratePercentLabel: `${Number(row.roi_rate)}% p.a.`,
    status: row.status === "active" ? "open" : "closed",
  };
}

export async function getOpenPackages(): Promise<InvestmentSlot[]> {
  try {
    const { data } = await apiFetch<PackageApiRow[]>("/packages");
    return data.map(toInvestmentSlot);
  } catch {
    return [];
  }
}
