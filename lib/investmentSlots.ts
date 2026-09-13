import { formatDisplayDate } from "@/lib/formatters";

export type SlotPackage = "core" | "ventures";
export type SlotStatus = "open" | "closed";

export const SLOT_PACKAGE_LABEL: Record<SlotPackage, string> = {
  core: "AUREX Core",
  ventures: "AUREX Ventures",
};

export type InvestmentSlot = {
  id: string;
  name: string;
  package: SlotPackage;
  /** Only set for Ventures slots — the specific business the slot raises
   *  funds for. Core slots pool into AUREX itself, so there's no single
   *  business to name. */
  businessName?: string;
  minInvestmentGhs: number;
  termLabel: string;
  opensAt: string;
  closesAt: string;
  /** e.g. "12% p.a." — Admin's own figure, not something computed from a
   *  rate + term. */
  ratePercentLabel: string;
  status: SlotStatus;
};

/** "Open until 30 Mar 2026" / "Closed on 20 Dec 2025" — reads off `status`
 *  and `closesAt` as given, doesn't decide open/closed itself. */
export function getSlotWindowLabel(slot: InvestmentSlot): string {
  return slot.status === "closed"
    ? `Closed on ${formatDisplayDate(slot.closesAt)}`
    : `Open until ${formatDisplayDate(slot.closesAt)}`;
}
