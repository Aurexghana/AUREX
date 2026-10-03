"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import InvestmentSlotCard from "@/components/dashboard/InvestmentSlotCard";
import type { InvestmentSlot, SlotPackage } from "@/lib/investmentSlots";

type Filter = "all" | SlotPackage;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "core", label: "Core" },
  { value: "ventures", label: "Ventures" },
];

/**
 * The Investment tab's own content (app/dashboard/investment/page.tsx) -
 * every slot here is something Admin has actively published and wants
 * investors to act on, which is also why Investment is the tab
 * app/dashboard/page.tsx redirects to by default rather than Earnings or
 * Leaderboard. Filter state is plain useState, not persisted - the brief
 * is explicit this dashboard uses React state only, no localStorage/
 * sessionStorage.
 */
export default function OpenSlotsSection({
  slots,
  whatsappNumber,
}: {
  slots: InvestmentSlot[];
  whatsappNumber: string | null;
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const visibleSlots = slots.filter((slot) => filter === "all" || slot.package === filter);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <h2 className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">Open Investment Slots</h2>
          <p className="font-sans text-sm text-cream-dim">Opportunities Admin has published for you to back.</p>
        </div>

        <div className="flex items-center gap-2 border border-grid-line p-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={`px-3.5 py-1.5 font-jakarta text-sm font-medium transition-colors ${
                filter === f.value
                  ? "bg-gold-bright text-amainblack"
                  : "text-cream-dim hover:text-cream"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {visibleSlots.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visibleSlots.map((slot) => (
            <motion.div key={slot.id} variants={staggerItem}>
              <InvestmentSlotCard slot={slot} whatsappNumber={whatsappNumber} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center gap-2 border border-grid-line py-12 text-center">
          <p className="font-jakarta text-sm font-medium text-cream">No {filter} slots right now.</p>
          <p className="font-sans text-sm text-cream-dim">Check back soon, or try a different filter.</p>
        </div>
      )}
    </section>
  );
}
