/**
 * The Report tab shared by both dashboards (see
 * components/dashboard/ReportSection.tsx) — a member flagging a problem
 * or asking Admin a question. Backed by Aurex-backend's `/reports` and
 * `/investments` endpoints.
 */

import { apiFetch, apiUpload } from "@/lib/api/client";
import type { SelectOption } from "@/lib/optionalDetails";
import { formatGhs } from "@/lib/formatters";
import type { BusinessListing } from "@/lib/businessListing";
import type { InvestmentHolding } from "@/lib/investorPortfolio";

export type ReportRole = "investor" | "business";
export type ReportPriority = "low" | "medium" | "high";
export type ReportStatus = "open" | "in_progress" | "resolved";

export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
};

// Category lists straight from the brief, one per role — a category
// meaningful to an Investor (e.g. "Leaderboard issue") isn't necessarily
// meaningful to a Business Owner and vice versa, so ReportSection picks
// between these by its `role` prop rather than showing one combined list.
// The backend stores whatever label is picked here as free text (not a
// shared enum) — see reports.table.ts's own comment on that column.
export const INVESTOR_REPORT_CATEGORIES: SelectOption[] = [
  { value: "investment-not-showing", label: "Investment not showing on dashboard" },
  { value: "incorrect-earnings", label: "Incorrect earnings figure" },
  { value: "admin-whatsapp-issue", label: "Issue with Admin/WhatsApp communication" },
  { value: "payment-proof-dispute", label: "Proof of payment dispute" },
  { value: "leaderboard-issue", label: "Leaderboard issue" },
  { value: "account-issue", label: "Account issue" },
  { value: "other", label: "Other" },
];

export const BUSINESS_REPORT_CATEGORIES: SelectOption[] = [
  { value: "funding-not-updating", label: "Funding progress not updating" },
  { value: "listing-info-incorrect", label: "Listing information incorrect" },
  { value: "admin-issue", label: "Issue with Admin communication" },
  { value: "account-issue", label: "Account issue" },
  { value: "other", label: "Other" },
];

export const REPORT_PRIORITY_OPTIONS: { value: ReportPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const PRIORITY_LABEL_LOOKUP: Record<string, string> = Object.fromEntries(
  REPORT_PRIORITY_OPTIONS.map((p) => [p.value, p.label]),
);

// The backend's priority enum also allows "critical" (used elsewhere by
// Admin), which never appears in REPORT_PRIORITY_OPTIONS since members
// never choose it here — fall back to a capitalized raw value for it
// rather than throwing away an unrecognized priority.
function priorityLabelFor(value: string): string {
  return PRIORITY_LABEL_LOOKUP[value] ?? value.charAt(0).toUpperCase() + value.slice(1);
}

// Sentinel "related record" value for "Not related to a specific record" —
// always the first option and the default selection, ahead of whatever
// role-specific records ReportSection is given.
export const NOT_RELATED_VALUE = "none";
export const NOT_RELATED_OPTION: SelectOption = { value: NOT_RELATED_VALUE, label: "Not related to a specific record" };

/** An Investor's own recorded holdings, as "related record" choices — e.g.
 *  "GreenHarvest Foods · GHS 3,000". Same title logic as HoldingRow's own
 *  (businessName for a Ventures holding, the package label otherwise). */
export function getInvestorRelatedRecordOptions(holdings: InvestmentHolding[]): SelectOption[] {
  return holdings.map((h) => ({
    value: h.id,
    label: `${h.businessName ?? h.packageName} · ${formatGhs(h.amountInvestedGhs)}`,
  }));
}
/** A Business Owner only ever has the one listing, so this is a single
 *  option naming it — still routed through the same "related record"
 *  dropdown (rather than assumed automatically) so a report about
 *  something else entirely can still pick "Not related to a specific
 *  record" instead. No backend "business listing" record exists yet, so
 *  this stays local/mock the same as lib/businessListing.ts itself. */
export function getBusinessRelatedRecordOptions(listing: BusinessListing): SelectOption[] {
  return [{ value: "listing", label: listing.businessName }];
}

type InvestmentApiRow = {
  id: string;
  package_name: string;
  business_name: string | null;
  amount_invested: string;
  status: string;
};

/** An Investor's own recorded investments, as "related record" choices —
 *  e.g. "GreenHarvest Foods — GHS 3,000". Each option's `value` is the
 *  investment's id, which submitReport sends straight through as
 *  `investment_id`. */
export async function getMyInvestmentOptions(): Promise<SelectOption[]> {
  const { data } = await apiFetch<InvestmentApiRow[]>("/investments");
  return data.map((row) => ({
    value: row.id,
    label: `${row.business_name ?? row.package_name} — ${formatGhs(Number(row.amount_invested))}`,
  }));
}

export type AdminReply = {
  message: string;
  respondedAt: string;
};

export type Report = {
  id: string;
  categoryLabel: string;
  /** Null means "Not related to a specific record" was chosen. */
  relatedRecordLabel: string | null;
  subject: string;
  description: string;
  priorityLabel: string;
  attachmentName: string | null;
  status: ReportStatus;
  submittedAt: string;
  adminReply: AdminReply | null;
};

type ReportApiRow = {
  id: string;
  category: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  attachment_url: string | null;
  related_record_label: string | null;
  admin_response: string | null;
  responded_at: string | null;
  created_at: string;
};

function fileNameFromUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const pathname = new URL(url).pathname;
    return decodeURIComponent(pathname.split("/").pop() || url);
  } catch {
    return url;
  }
}

function toReport(row: ReportApiRow): Report {
  return {
    id: row.id,
    categoryLabel: row.category,
    relatedRecordLabel: row.related_record_label,
    subject: row.subject,
    description: row.description,
    priorityLabel: priorityLabelFor(row.priority),
    attachmentName: fileNameFromUrl(row.attachment_url),
    status: row.status as ReportStatus,
    submittedAt: row.created_at,
    adminReply: row.admin_response
      ? { message: row.admin_response, respondedAt: row.responded_at ?? row.created_at }
      : null,
  };
}

/** The member's own report history, newest first (the API's own default
 *  sort). Capped at 100 — nobody files that many reports. */
export async function getMyReports(): Promise<Report[]> {
  const { data } = await apiFetch<ReportApiRow[]>("/reports/mine?limit=100");
  return data.map(toReport);
}

export type SubmitReportInput = {
  categoryLabel: string;
  relatedRecordLabel: string | null;
  subject: string;
  description: string;
  priorityLabel: string;
  attachmentName: string | null;
  /** Raw enum value backing `priorityLabel` — the API stores this, not the label. */
  priorityValue: ReportPriority;
  /** The selected investment's id (investor track only) — null when "Not
   *  related to a specific record" was chosen, or when the related-record
   *  dropdown's selection isn't a real investment (the business track's
   *  single "listing" option), in which case `relatedRecordLabel` is sent
   *  instead as free text. */
  investmentId: string | null;
  /** The actual file to upload — attachmentName above is only ever used
   *  for immediate display, the API needs the file itself. */
  attachment: File | null;
};

export async function submitReport(input: SubmitReportInput): Promise<Report> {
  const formData = new FormData();
  formData.set("category", input.categoryLabel);
  formData.set("subject", input.subject);
  formData.set("description", input.description);
  formData.set("priority", input.priorityValue);
  if (input.investmentId) {
    formData.set("investment_id", input.investmentId);
  } else if (input.relatedRecordLabel) {
    formData.set("related_record_label", input.relatedRecordLabel);
  }
  if (input.attachment) formData.set("attachment", input.attachment);

  const { data } = await apiUpload<ReportApiRow>("/reports", formData);
  return toReport(data);
}
