import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import ActivationFlow from "@/components/ActivationFlow";

export const metadata: Metadata = {
  title: "Create Your Account | AUREX",
  description: "Set a password to finish activating your AUREX account.",
};

/**
 * The screen an "your application was approved" email would link to
 * (?token=...) - reached only after Admin approves an Investor or
 * Business Owner application (see components/ApplicationStatusScreen's own
 * "approved" state, which currently sends people to their dashboard
 * directly since this flow didn't exist yet; a real approval action would
 * email this link instead of that). Same minimal chrome as /login,
 * /forgot-password, and /reset-password - logo + centered card, no site
 * Navbar/Footer, since this is a focused, single-purpose screen reached
 * outside any authenticated session.
 *
 * ActivationFlow reads the token via useSearchParams, which Next.js
 * requires a Suspense boundary for on static builds - see
 * ResetPasswordFlow.tsx's own comment for the same reasoning.
 */
export default function ActivatePage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <Link href="/" aria-label="AUREX home">
          <BrandMark variant="nav" />
        </Link>

        <Suspense fallback={null}>
          <ActivationFlow />
        </Suspense>
      </div>
    </main>
  );
}
