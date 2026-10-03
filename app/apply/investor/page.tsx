import type { Metadata } from "next";
import InvestorApplication from "@/components/apply/investor/InvestorApplication";

export const metadata: Metadata = {
  title: "Investor Application | AUREX",
  description: "Apply to become an AUREX investor with a short, guided application to get started.",
};

/**
 * Step 1 of the 6-step AUREX Investor Application (Identity & Contact ->
 * Nickname -> ID Upload -> Optional Details -> Review & Submit ->
 * Confirmation). Reached from the "Invest with AUREX" option in
 * JoinAurexModal.
 *
 * Deliberately skips the site's usual Navbar/Footer chrome - this is a
 * focused, low-friction application flow, not a marketing page, so
 * MultiStepFormShell renders its own minimal header (logo + exit link)
 * instead. Steps 3-6 aren't built yet; see
 * components/apply/investor/StepTwoPlaceholder.tsx.
 */
export default function InvestorApplicationPage() {
  return <InvestorApplication />;
}
