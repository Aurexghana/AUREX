"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { formatGhs } from "@/lib/formatters";
import BrandMark from "@/components/BrandMark";
import LogoutButton from "@/components/dashboard/LogoutButton";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { MOCK_INVESTOR, getMyHoldings, type InvestmentHolding } from "@/lib/investorPortfolio";

/**
 * Shared shell for the whole Investor Dashboard: logo/log-out header, the
 * welcome banner + running Total Invested figure, and the Investment /
 * Earnings / Leaderboard tab bar - all of which used to live inside one
 * long-scrolling InvestorDashboard.tsx, now split into their own routes
 * (app/dashboard/{investment,earnings,leaderboard}/page.tsx) per request,
 * so each is its own real page instead of a section on one screen.
 *
 * Lives in its own file (rather than directly in app/dashboard/layout.tsx)
 * purely so that file can wrap this in a <Suspense> boundary -
 * DashboardTabs calls useSearchParams(), and Next.js requires that hook's
 * nearest client-component ancestor to sit inside Suspense for static
 * builds, which a route's own layout.tsx can't itself satisfy by wrapping
 * its own return value.
 *
 * The auth guard lives here, once, instead of in each of the three tab
 * pages - useRequireAuth's `if (isLoading || !user) return null` below
 * blocks every child route the same way the old single component did for
 * its one page.
 *
 * Holdings are fetched here too (not passed down from a page) purely to
 * compute the header's own Total Invested figure, which per the brief
 * needs to stay visible across every tab, not just the Earnings one - so
 * this and app/dashboard/earnings/page.tsx each fetch independently
 * rather than one passing data down to the other.
 */
export default function InvestorDashboardShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useRequireAuth();
  const [holdings, setHoldings] = useState<InvestmentHolding[]>([]);

  useEffect(() => {
    if (isLoading || !user) return;
    let cancelled = false;
    getMyHoldings().then((data) => {
      if (!cancelled) setHoldings(data);
    });
    return () => {
      cancelled = true;
    };
  }, [isLoading, user]);

  // "Total amount currently invested across all holdings" per the brief -
  // unlike EarningsSection's own headline figure (active investments
  // only), this deliberately includes matured holdings too.
  const totalInvested = holdings.reduce((sum, h) => sum + h.amountInvestedGhs, 0);

  if (isLoading || !user) return null;

  const displayName = user.nickname ?? MOCK_INVESTOR.nickname;

  return (
    <main className="flex flex-1 flex-col items-center px-4 pb-16 pt-8 sm:px-6 lg:px-10">
      <div className="flex w-full max-w-6xl flex-col gap-8">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="AUREX home">
            <BrandMark variant="nav" />
          </Link>
          <LogoutButton />
        </div>

        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="flex flex-col gap-8">
          <motion.div
            variants={staggerItem}
            className="flex flex-col items-start justify-between gap-6 border border-gold/20 bg-panel/40 p-6 backdrop-blur-2xl sm:flex-row sm:items-center sm:p-8"
          >
            <div className="flex flex-col gap-1.5">
              <p className="font-jakarta text-xs font-medium uppercase tracking-[1.8px] text-gold-muted">
                Investor Dashboard
              </p>
              <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">
                Welcome back, {displayName}
              </h1>
            </div>
            <div className="flex flex-col items-start gap-0.5 sm:items-end">
              <span className="font-sans text-xs uppercase tracking-wide text-cream-dim">Total Invested</span>
              <span className="font-jakarta text-2xl font-bold text-gold-bright sm:text-3xl">
                {formatGhs(totalInvested)}
              </span>
            </div>
          </motion.div>

          <motion.div variants={staggerItem}>
            <DashboardTabs basePath="/dashboard" extraTabs={[{ slug: "transactions", label: "Transactions" }]} />
          </motion.div>

          <motion.div variants={staggerItem}>{children}</motion.div>
        </motion.div>
      </div>
    </main>
  );
}
