"use client";

import { useEffect, useState } from "react";
import ReportSection from "@/components/dashboard/ReportSection";
import { useAuth } from "@/lib/auth/AuthContext";
import { MOCK_INVESTOR } from "@/lib/investorPortfolio";
import { getMyInvestmentOptions, getMyReports, type Report } from "@/lib/reports";
import type { SelectOption } from "@/lib/optionalDetails";

/**
 * The Investor Dashboard's "Report" tab. Client-fetched (rather than a
 * server component reading mock data) since both the member's own report
 * history and their investment options for the "Related Record" dropdown
 * come from authenticated API calls - see lib/reports.ts's getMyReports /
 * getMyInvestmentOptions.
 */
export default function DashboardReportPage() {
  const { user, isLoading } = useAuth();
  const [reports, setReports] = useState<Report[] | null>(null);
  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (isLoading || !user) return;
    let cancelled = false;
    Promise.all([getMyReports(), getMyInvestmentOptions()]).then(([r, o]) => {
      if (cancelled) return;
      setReports(r);
      setOptions(o);
    });
    return () => {
      cancelled = true;
    };
  }, [isLoading, user]);

  if (reports === null) {
    return <p className="px-4 py-10 text-center font-sans text-sm text-cream-dim">Loading…</p>;
  }

  return (
    <ReportSection
      role="investor"
      fallbackNickname={MOCK_INVESTOR.nickname}
      fallbackRealName={MOCK_INVESTOR.realName}
      relatedRecordOptions={options}
      initialReports={reports}
    />
  );
}
