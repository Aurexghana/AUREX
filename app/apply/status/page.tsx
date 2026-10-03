import type { Metadata } from "next";
import ApplicationStatusScreen from "@/components/apply/ApplicationStatusScreen";
import { parseApplicationStatus, parseStringParam } from "@/lib/applicationStatusParams";

export const metadata: Metadata = {
  title: "Application Status | AUREX",
  description: "Check the status of your AUREX Investor Application.",
};

/**
 * Standalone landing spot for a returning applicant checking their status
 * later (e.g. a "check my application status" link) - distinct from
 * reaching this same screen as Step 6 right after submitting (see
 * components/apply/investor/ConfirmationStep.tsx, reached only through the
 * Investor Application flow itself).
 *
 * There's no backend/auth yet to look an application up by session or
 * account, so status/nickname/phone are read straight from the URL's own
 * query string as a stub data source - e.g.
 * /apply/status?status=approved&nickname=GoldFalcon - defaulting to a
 * generic "pending" view for a bare /apply/status with no query string at
 * all. Swapping this for a real lookup later means changing this file, not
 * ApplicationStatusScreen itself.
 */
export default async function ApplicationStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
    <ApplicationStatusScreen
      status={parseApplicationStatus(params.status)}
      nickname={parseStringParam(params.nickname)}
      phone={parseStringParam(params.phone)}
      purpose="invest with AUREX"
      applicationLabel="Investor Application"
      reapplyHref="/apply/investor"
    />
  );
}
