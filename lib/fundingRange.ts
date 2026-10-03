import type { SelectOption } from "@/lib/optionalDetails";

/**
 * "Amount of funding sought" for Step 1 of the Business Owner Application
 * - banded ranges rather than a raw numeric field, matching the Investor
 * flow's own "Intended Investment Range" pattern (see
 * lib/optionalDetails.ts's INVESTMENT_RANGE_OPTIONS) so the two flows ask
 * for a monetary figure the same way. GHS-denominated per the brief.
 */
export const FUNDING_RANGE_OPTIONS: SelectOption[] = [
  { value: "under-10000", label: "Under GHS 10,000" },
  { value: "10000-50000", label: "GHS 10,000 – 50,000" },
  { value: "50000-200000", label: "GHS 50,000 – 200,000" },
  { value: "200000-plus", label: "GHS 200,000+" },
];
