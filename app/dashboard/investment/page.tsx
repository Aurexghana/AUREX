"use client";

import { useEffect, useState } from "react";
import OpenSlotsSection from "@/components/dashboard/OpenSlotsSection";
import { useAuth } from "@/lib/auth/AuthContext";
import { getOpenPackages } from "@/lib/packages";
import { getSuperAdminWhatsAppNumber } from "@/lib/whatsapp";
import type { InvestmentSlot } from "@/lib/investmentSlots";

export default function DashboardInvestmentPage() {
  const { user, isLoading } = useAuth();
  const [slots, setSlots] = useState<InvestmentSlot[] | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading || !user) return;
    let cancelled = false;
    getOpenPackages().then((data) => {
      if (!cancelled) setSlots(data);
    });
    getSuperAdminWhatsAppNumber().then((phone) => {
      if (!cancelled) setWhatsappNumber(phone);
    });
    return () => {
      cancelled = true;
    };
  }, [isLoading, user]);

  if (slots === null) {
    return <p className="px-4 py-10 text-center font-sans text-sm text-cream-dim">Loading…</p>;
  }

  return <OpenSlotsSection slots={slots} whatsappNumber={whatsappNumber} />;
}
