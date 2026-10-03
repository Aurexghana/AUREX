import type { Metadata } from "next";
import ApplicationStatusScreen from "@/components/apply/ApplicationStatusScreen";
import { parseApplicationStatus, parseStringParam } from "@/lib/applicationStatusParams";

export const metadata: Metadata = {
  title: "Application Status | AUREX",
  description: "Check the status of your AUREX Business Owner Application.",
};

/**
 * Standalone landing spot for a returning business applicant checking
 * their status later - the Business Owner flow's equivalent of
 * app/apply/status/page.tsx (see that file's own comment for the full
 * reasoning; identical approach here, just reading an extra `business`
 * query param since this flow's pending message needs to name the
 * business being listed, which the Investor flow's message never does).
 */
export default async function BusinessApplicationStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const businessName = parseStringParam(params.business);

  return (
    <ApplicationStatusScreen
      status={parseApplicationStatus(params.status)}
      nickname={parseStringParam(params.nickname)}
      phone={parseStringParam(params.phone)}
      purpose={`list ${businessName || "your business"} on AUREX`}
      applicationLabel="Business Owner Application"
      reapplyHref="/apply-business"
      dashboardHref="/business-dashboard"
    />
  );
}
