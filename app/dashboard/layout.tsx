import { Suspense } from "react";
import InvestorDashboardShell from "@/components/dashboard/InvestorDashboardShell";

/**
 * Thin wrapper only - the actual shell (header, tabs, auth guard) is a
 * Client Component (components/dashboard/InvestorDashboardShell.tsx)
 * because it needs useAuth/useRequireAuth, and its own DashboardTabs
 * child calls useSearchParams(). Next.js requires that hook to sit
 * inside a <Suspense> boundary for static builds; a layout.tsx can't
 * wrap its own returned JSX in Suspense and have that cover itself, so
 * this file's only job is providing that boundary one level up.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <InvestorDashboardShell>{children}</InvestorDashboardShell>
    </Suspense>
  );
}
