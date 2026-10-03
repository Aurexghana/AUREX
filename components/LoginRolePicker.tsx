"use client";

import { motion } from "framer-motion";
import { hoverLift } from "@/lib/motion";
import { AumIcon, DocumentIcon } from "@/components/icons";
import type { LoginRole } from "@/components/LoginFlow";

const ROLE_OPTIONS: { role: LoginRole; title: string; description: string; Icon: typeof AumIcon }[] = [
  {
    role: "investor",
    title: "Investor",
    description: "Access your investments and earnings.",
    Icon: AumIcon,
  },
  {
    role: "business",
    title: "Business Owner",
    description: "Track your listing and funding progress.",
    Icon: DocumentIcon,
  },
];

/**
 * The first thing you see on /login, before either credentials form - the
 * two roles land on entirely separate dashboards (see LoginFlow), so which
 * one you're logging in as has to be picked before there's a form to fill
 * in at all. Text-only cards (no photos, unlike JoinAurexModal's own two-
 * option layout) since this sits inside the login page's much narrower
 * card rather than a full-width modal.
 */
export default function LoginRolePicker({ onSelect }: { onSelect: (role: LoginRole) => void }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {ROLE_OPTIONS.map(({ role, title, description, Icon }) => (
        <motion.button
          key={role}
          {...hoverLift}
          type="button"
          onClick={() => onSelect(role)}
          className="flex flex-col items-start gap-2.5 border border-grid-line bg-ink-light/20 p-5 text-left transition-colors hover:border-gold light:bg-white/50"
        >
          <Icon className="size-5 text-gold-bright" />
          <span className="font-jakarta text-base font-semibold text-cream">{title}</span>
          <span className="font-sans text-xs text-cream-dim">{description}</span>
        </motion.button>
      ))}
    </div>
  );
}
