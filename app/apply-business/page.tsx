import type { Metadata } from "next";
import BusinessOwnerApplication from "@/components/apply/business/BusinessOwnerApplication";

export const metadata: Metadata = {
  title: "Business Owner Application | AUREX",
  description: "Apply to list your business on AUREX and raise funding from AUREX investors.",
};

/**
 * The 6-step Business Owner Application (Applicant & Business -> Nickname
 * -> Documents -> Optional Details -> Review & Submit -> Confirmation).
 * Reached from the "List Your Business" option in JoinAurexModal.
 *
 * Lives at /apply-business rather than /apply/business - matching the
 * brief's own standalone-status-route example (/apply-business/status)
 * rather than nesting under the Investor flow's /apply/investor segment,
 * since these are two parallel, independent flows sharing a shell, not one
 * flow with sub-routes.
 */
export default function BusinessOwnerApplicationPage() {
  return <BusinessOwnerApplication />;
}
