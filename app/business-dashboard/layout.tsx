import { Suspense } from "react";
import BusinessDashboardShell from "@/components/dashboard/business/BusinessDashboardShell";

/**
 * Thin wrapper only - see components/dashboard/InvestorDashboardShell.tsx's
 * own comment (same reasoning applies here): the real shell needs to be a
 * Client Component using useSearchParams(), which Next.js requires to sit
 * inside a <Suspense> boundary for static builds. A layout.tsx can't wrap
 * its own returned JSX in Suspense and have that cover itself, so this
 * file's only job is providing that boundary one level up.
 */
export default function BusinessDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <BusinessDashboardShell>{children}</BusinessDashboardShell>
    </Suspense>
  );
}
