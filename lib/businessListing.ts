import { apiFetch } from "@/lib/api/client";

export type ListingStatus = "pending" | "live" | "funded" | "closed";

export const LISTING_STATUS_LABEL: Record<ListingStatus, string> = {
  pending: "Pending Review",
  live: "Live",
  funded: "Funded",
  closed: "Closed",
};

export type BusinessListing = {
  businessName: string;
  ownerNickname: string;
  ownerRealName: string;
  description: string;
  fundingPurpose: string;
  fundingGoalGhs: number;
  amountRaisedGhs: number;
  backerCount: number;
  status: ListingStatus;
};

type ListingApiRow = {
  business_name: string;
  owner_nickname: string | null;
  owner_real_name: string | null;
  description: string | null;
  funding_purpose: string | null;
  funding_goal: string | null;
  amount_raised: string;
  backer_count: number;
  status: ListingStatus;
};

function toBusinessListing(row: ListingApiRow): BusinessListing {
  return {
    businessName: row.business_name,
    ownerNickname: row.owner_nickname ?? "-",
    ownerRealName: row.owner_real_name ?? "-",
    description: row.description ?? "",
    fundingPurpose: row.funding_purpose ?? "",
    fundingGoalGhs: row.funding_goal ? Number(row.funding_goal) : 0,
    amountRaisedGhs: Number(row.amount_raised),
    backerCount: row.backer_count,
    status: row.status,
  };
}

export async function getMyListing(): Promise<BusinessListing | undefined> {
  try {
    const { data } = await apiFetch<ListingApiRow>("/businesses/me/listing");
    return toBusinessListing(data);
  } catch {
    return undefined;
  }
}

export function getFundingPercent(listing: BusinessListing): number {
  if (listing.fundingGoalGhs <= 0) return 0;
  return Math.min(100, Math.round((listing.amountRaisedGhs / listing.fundingGoalGhs) * 100));
}
