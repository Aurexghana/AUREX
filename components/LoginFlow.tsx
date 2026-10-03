"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { easing } from "@/lib/motion";
import LoginRolePicker from "@/components/LoginRolePicker";
import LoginForm from "@/components/LoginForm";

export type LoginRole = "investor" | "business";

const ROLE_LABEL: Record<LoginRole, string> = {
  investor: "Investor",
  business: "Business Owner",
};

/**
 * The whole /login experience: which dashboard you land on (Investor vs
 * Business Owner) depends on which role you're logging in as, so that has
 * to be picked before there's a credentials form to show at all - see
 * app/login/page.tsx for how this replaces what used to be a single
 * always-visible LoginForm.
 *
 * `role` starts null (the picker); choosing one reveals that role's form
 * in its place, with a "Choose a different role" link back to the picker
 * rather than a second, separate page - nothing here needs its own route,
 * this is one screen with two phases. The picker phase gets its own
 * "Back to Home" link (the page's own logo up top already links home, but
 * it's icon-only - this is the same escape hatch as an actual visible
 * link, matching "Choose a different role"'s own treatment one step
 * later in the flow).
 *
 * The "AUREX Login" eyebrow that used to sit above "Welcome Back" is
 * gone per request - the outer card, the logo above it (see
 * app/login/page.tsx), and the page's own <title> already say what this
 * screen is, so it was a redundant label rather than new information.
 *
 * Content is grouped into its own sub-section (this header, then -
 * inside LoginForm - the fields and the submit button each get one
 * too) all sharing the same `gap-5` rhythm, so the spacing between
 * every section reads as one consistent system rather than whatever
 * margin each part happened to need before. No border on any of
 * these - just the grouping and padding, so it doesn't compete with
 * the outer card's own gold border.
 */
export default function LoginFlow() {
  const [role, setRole] = useState<LoginRole | null>(null);

  return (
    <div className="flex w-full flex-col gap-5 border border-gold/20 bg-panel/40 p-6 backdrop-blur-2xl sm:p-8">
      <div className="flex flex-col gap-1.5 p-5">
        <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Welcome Back</h1>
        <p className="font-sans text-sm text-cream-dim">
          {role
            ? `Enter your details to access your ${ROLE_LABEL[role]} Dashboard.`
            : "Choose how you'd like to log in."}
        </p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {role === null ? (
          <motion.div
            key="picker"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: easing.smooth }}
            className="flex flex-col gap-5"
          >
            <LoginRolePicker onSelect={setRole} />
            <Link
              href="/"
              className="w-fit font-sans text-xs text-cream-dim underline-offset-4 transition-colors hover:text-gold-light hover:underline"
            >
              ← Back to Home
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: easing.smooth }}
            className="flex flex-col gap-5"
          >
            <button
              type="button"
              onClick={() => setRole(null)}
              className="w-fit font-sans text-xs text-cream-dim underline-offset-4 transition-colors hover:text-gold-light hover:underline"
            >
              ← Choose a different role
            </button>
            <LoginForm role={role} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
