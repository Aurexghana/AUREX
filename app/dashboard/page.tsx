import { redirect } from "next/navigation";

/**
 * `/dashboard` itself is no longer a page - it's the three tabs living at
 * app/dashboard/{investment,earnings,leaderboard}/page.tsx now. Redirects
 * to Investment, the same tab InvestorDashboard.tsx used to put first
 * ("since that's what should drive action").
 */
export default function DashboardIndexPage() {
  redirect("/dashboard/investment");
}
