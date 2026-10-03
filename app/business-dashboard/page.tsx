import { redirect } from "next/navigation";

/**
 * `/business-dashboard` itself is no longer a page - it's the three tabs
 * living at app/business-dashboard/{investment,earnings,leaderboard}/
 * page.tsx now. Redirects to Investment (the listing itself), the same
 * "status always renders first" ordering the old single-page dashboard
 * used. Carries `?status=` along so the dev-preview stub
 * (/business-dashboard?status=pending) still lands on the right state
 * instead of silently resetting to the "live" default.
 */
export default async function BusinessDashboardIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  redirect(status ? `/business-dashboard/investment?status=${status}` : "/business-dashboard/investment");
}
