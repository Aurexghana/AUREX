"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const TABS = [
  { slug: "investment", label: "Investment" },
  { slug: "earnings", label: "Earnings" },
  { slug: "leaderboard", label: "Leaderboard" },
  { slug: "report", label: "Report" },
] as const;

/**
 * The tab bar shared by both the Investor Dashboard (/dashboard/*) and
 * the Business Owner Dashboard (/business-dashboard/*) - same four
 * tabs, same component, just a different `basePath` per role. What each
 * tab actually shows differs by role (see each role's own
 * app/(dashboard route)/{tab}/page.tsx - an investor's Investment tab is
 * open slots to back, a business owner's is their listing status/detail;
 * Report is the one tab whose content (components/dashboard/
 * ReportSection.tsx) is already the exact same component for both roles),
 * but the navigation itself is one shared piece rather than two
 * lookalike copies.
 *
 * Same active-link treatment as the main site's own Navbar.tsx desktop
 * links (gold underline + gold-clip-text gradient on the active tab)
 * rather than inventing a new tab-bar style, since this is the same
 * "which of a few top-level destinations am I on" job.
 */
export default function DashboardTabs({
  basePath,
  extraTabs = [],
}: {
  basePath: string;
  /** Role-specific tabs, inserted before Report (e.g. the investor's Transactions). */
  extraTabs?: { slug: string; label: string }[];
}) {
  const pathname = usePathname();
  // Carries the current query string across tab switches, so any
  // ?param a tab relies on (e.g. the leaderboard's own ?me=) survives
  // switching tabs instead of being silently dropped.
  const queryString = useSearchParams().toString();

  const tabs = [...TABS.slice(0, 3), ...extraTabs, ...TABS.slice(3)];

  return (
    <nav aria-label="Dashboard sections" className="flex items-center gap-6 overflow-x-auto border-b border-grid-line sm:gap-8">
      {tabs.map(({ slug, label }) => {
        const href = `${basePath}/${slug}${queryString ? `?${queryString}` : ""}`;
        const isActive = pathname === `${basePath}/${slug}`;
        return (
          <Link
            key={slug}
            href={href}
            className={
              isActive
                ? "shrink-0 whitespace-nowrap border-b-2 border-gold bg-gradient-to-r from-gold via-gold-light via-50% to-gold bg-clip-text pb-3 font-jakarta text-sm font-semibold tracking-[0.3px] text-transparent"
                : "shrink-0 whitespace-nowrap border-b-2 border-transparent pb-3 font-sans text-sm font-medium tracking-[0.3px] text-neutral-200 transition-colors hover:text-cream light:text-[#1a1a1a] light:hover:text-gold-deep"
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
