"use client";

import { useEffect, useState } from "react";
import ReportSection from "@/components/dashboard/ReportSection";
import { useAuth } from "@/lib/auth/AuthContext";
import { getMyListing, type BusinessListing } from "@/lib/businessListing";
import { getBusinessRelatedRecordOptions, getMyReports, type Report } from "@/lib/reports";

export default function BusinessDashboardReportPage() {
  const { user, isLoading } = useAuth();
  const [reports, setReports] = useState<Report[] | null>(null);
  const [listing, setListing] = useState<BusinessListing | null>(null);

  useEffect(() => {
    if (isLoading || !user) return;
    let cancelled = false;
    Promise.all([getMyReports(), getMyListing()]).then(([r, l]) => {
      if (cancelled) return;
      setReports(r);
      setListing(l ?? null);
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
      role="business"
      fallbackNickname={listing?.ownerNickname ?? "there"}
      fallbackRealName={listing?.ownerRealName ?? "-"}
      relatedRecordOptions={listing ? getBusinessRelatedRecordOptions(listing) : []}
      initialReports={reports}
    />
  );
}
