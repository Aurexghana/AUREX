"use client";

import { motion } from "framer-motion";
import { hoverLift, hoverScale } from "@/lib/motion";
import { formatGhs } from "@/lib/formatters";
import { getSlotWhatsAppLink } from "@/lib/whatsapp";
import {
  SLOT_PACKAGE_LABEL,
  getSlotWindowLabel,
  type InvestmentSlot,
} from "@/lib/investmentSlots";

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-sans text-[11px] uppercase tracking-wide text-cream-dim">{label}</span>
      <span className="font-jakarta text-sm font-medium text-cream">{value}</span>
    </div>
  );
}

/**
 * One published slot on the "Open Investment Slots" grid — this is the
 * dashboard's primary, most action-oriented surface (see
 * OpenSlotsSection's own comment), so it gets the app's usual glass-card
 * treatment plus a hover lift, same as InvestmentPackages' own cards.
 *
 * "Invest" never collects payment in-platform — it just opens a WhatsApp
 * chat with Admin, pre-filled with which slot was tapped (see
 * lib/whatsapp.ts). A closed slot renders a disabled "Closed" state
 * instead of a working link.
 */
export default function InvestmentSlotCard({ slot }: { slot: InvestmentSlot }) {
  const isOpen = slot.status === "open";
  const title = slot.businessName ?? slot.name;
  const whatsappMessage =
    slot.package === "ventures" && slot.businessName
      ? `AUREX Ventures · ${slot.businessName} · ${slot.name}`
      : `${SLOT_PACKAGE_LABEL[slot.package]} · ${slot.name}`;

  return (
    <motion.div
      {...(isOpen ? hoverLift : {})}
      className={`flex flex-col gap-5 border p-6 backdrop-blur-2xl ${
        isOpen ? "border-gold/20 bg-panel/40" : "border-grid-line bg-panel/20"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 font-jakarta text-[10px] font-medium uppercase tracking-wide ${
            isOpen ? "border-gold/30 text-gold-bright" : "border-grid-line text-cream-dim"
          }`}
        >
          {SLOT_PACKAGE_LABEL[slot.package]}
        </span>
        {!isOpen && (
          <span className="inline-flex w-fit items-center rounded-full border border-grid-line px-2.5 py-0.5 font-jakarta text-[10px] font-medium uppercase tracking-wide text-cream-dim">
            Closed
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-jakarta text-lg font-semibold text-cream">{title}</h3>
        <p className={`font-jakarta text-2xl font-bold ${isOpen ? "text-gold-bright" : "text-cream-dim"}`}>
          {slot.ratePercentLabel}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-grid-line pt-4">
        <StatRow label="Minimum" value={formatGhs(slot.minInvestmentGhs)} />
        <StatRow label="Term" value={slot.termLabel} />
        <StatRow label="Availability" value={getSlotWindowLabel(slot)} />
      </div>

      {isOpen ? (
        <motion.a
          {...hoverScale}
          href={getSlotWhatsAppLink(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3 font-jakarta text-sm font-medium text-amainblack transition-opacity"
        >
          Invest
        </motion.a>
      ) : (
        <button
          type="button"
          disabled
          className="flex cursor-not-allowed items-center justify-center gap-2 border border-grid-line px-6 py-3 font-jakarta text-sm font-medium text-cream-dim opacity-60"
        >
          Closed
        </button>
      )}
    </motion.div>
  );
}
