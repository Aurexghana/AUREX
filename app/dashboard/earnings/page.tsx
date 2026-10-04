"use client";

import { useEffect, useState } from "react";
import EarningsSection from "@/components/dashboard/EarningsSection";
import { useAuth } from "@/lib/auth/AuthContext";
import { getMyHoldings } from "@/lib/investorPortfolio";
import type { InvestmentHolding } from "@/lib/investorPortfolio";

export default function DashboardEarningsPage() {
  const { user, isLoading } = useAuth();
  const [holdings, setHoldings] = useState<InvestmentHolding[] | null>(null);

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

  if (holdings === null) {
    return <p className="px-4 py-10 text-center font-sans text-sm text-cream-dim">Loading…</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <EarningsSection holdings={holdings} />
    </div>
  );
}
