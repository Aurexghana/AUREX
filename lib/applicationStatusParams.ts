import type { ApplicationStatus } from "@/components/apply/ApplicationStatusScreen";

/**
 * Shared query-string parsing for both flows' standalone status routes
 * (app/apply/status and app/apply-business/status) - there's no
 * backend/auth yet to look an application up for real, so both pages read
 * status/nickname/phone/etc. straight off the URL as a stub data source.
 * Extracted here once a second flow needed the exact same parsing.
 */

const VALID_STATUSES: ApplicationStatus[] = ["pending", "approved", "rejected"];

export function parseApplicationStatus(value: string | string[] | undefined): ApplicationStatus {
  const first = Array.isArray(value) ? value[0] : value;
  return (VALID_STATUSES as string[]).includes(first ?? "") ? (first as ApplicationStatus) : "pending";
}

export function parseStringParam(value: string | string[] | undefined): string | undefined {
  const first = Array.isArray(value) ? value[0] : value;
  return first || undefined;
}
