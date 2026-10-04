"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import BrandMark from "@/components/BrandMark";
import LogoutButton from "@/components/dashboard/LogoutButton";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { getMyListing, type BusinessListing } from "@/lib/businessListing";

/**
 * Shared shell for the Business Owner Dashboard - logo/log-out header,
 * welcome banner, and the Investment / Earnings / Report tab bar,
 * reinterpreted for this role: Investment is the listing itself (status +
 * details), Earnings is the funding raised so far. Business owners have no
 * Leaderboard - that's an investor-only feature. See each tab's own page
 * for the actual content.
 *
 * Lives in its own file (rather than directly in
 * app/business-dashboard/layout.tsx) purely so that file can wrap this
 * in a <Suspense> boundary - its DashboardTabs child calls
 * useSearchParams(), which Next.js requires to sit inside Suspense for
 * static builds; a route's own layout.tsx can't wrap its own returned
 * JSX in Suspense and have that cover itself.
 */
export default function BusinessDashboardShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useRequireAuth();
  const [listing, setListing] = useState<BusinessListing | null>(null);

  useEffect(() => {
    if (isLoading || !user) return;
    let cancelled = false;
    getMyListing().then((data) => {
      if (!cancelled) setListing(data ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [isLoading, user]);

  if (isLoading || !user) return null;

  const displayName = user.nickname ?? listing?.ownerNickname ?? "there";

  return (
    <main className="flex flex-1 flex-col items-center px-4 pb-16 pt-8 sm:px-6 lg:px-10">
      <div className="flex w-full max-w-2xl flex-col gap-8">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="AUREX home">
            <BrandMark variant="nav" />
          </Link>
          <LogoutButton />
        </div>

        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="flex flex-col gap-8">
          <motion.div
            variants={staggerItem}
            className="flex flex-col gap-1.5 border border-gold/20 bg-panel/40 p-6 backdrop-blur-2xl sm:p-8"
          >
            <p className="font-jakarta text-xs font-medium uppercase tracking-[1.8px] text-gold-muted">
              Business Owner Dashboard
            </p>
            <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">
              Welcome back, {displayName}
            </h1>
            <p className="font-sans text-sm text-cream-dim sm:text-base">
              Here&apos;s how {listing?.businessName ?? "your business"} is doing.
            </p>
          </motion.div>

          <motion.div variants={staggerItem}>
            <DashboardTabs basePath="/business-dashboard" hiddenSlugs={["leaderboard"]} />
          </motion.div>

          <motion.div variants={staggerItem}>{children}</motion.div>
        </motion.div>
      </div>
    </main>
  );
}
