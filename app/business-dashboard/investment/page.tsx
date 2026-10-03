"use client";

import { useEffect, useState } from "react";
import ListingStatusSection from "@/components/dashboard/business/ListingStatusSection";
import ListingDetailsSection from "@/components/dashboard/business/ListingDetailsSection";
import { useAuth } from "@/lib/auth/AuthContext";
import { getMyListing, type BusinessListing } from "@/lib/businessListing";
import { getWhatsAppNumber } from "@/lib/whatsapp";

export default function BusinessDashboardInvestmentPage() {
  const { user, isLoading } = useAuth();
  const [listing, setListing] = useState<BusinessListing | null | undefined>(undefined);
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading || !user) return;
    let cancelled = false;
    getMyListing().then((data) => {
      if (!cancelled) setListing(data ?? null);
    });
    getWhatsAppNumber().then((phone) => {
      if (!cancelled) setWhatsappNumber(phone);
    });
    return () => {
      cancelled = true;
    };
  }, [isLoading, user]);

  if (listing === undefined) {
    return <p className="px-4 py-10 text-center font-sans text-sm text-cream-dim">Loading…</p>;
  }

  if (listing === null) {
    return (
      <div className="flex flex-col items-center gap-2 border border-grid-line py-12 text-center">
        <p className="font-jakarta text-sm font-medium text-cream">No business on file for this account.</p>
        <p className="max-w-sm font-sans text-sm text-cream-dim">Contact AUREX Admin if you believe this is a mistake.</p>
      </div>
    );
  }

  const isPublished = listing.status !== "pending";

  return (
    <div className="flex flex-col gap-8">
      <ListingStatusSection listing={listing} />
      {isPublished && <ListingDetailsSection listing={listing} whatsappNumber={whatsappNumber} />}
    </div>
  );
}
