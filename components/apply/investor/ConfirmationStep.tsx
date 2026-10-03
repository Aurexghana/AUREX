"use client";

import { getCountryCallingCode, type CountryCode } from "libphonenumber-js/min";
import ApplicationStatusScreen from "@/components/apply/ApplicationStatusScreen";
import type { StepProps } from "@/components/apply/types";
import type { InvestorFormData } from "@/components/apply/investor/types";

/**
 * Step 6 of 6 - "Confirmation". Reached only via ReviewSubmitStep's own
 * goToStep("confirmation") call right after a successful submission - see
 * its `fullScreen: true` in InvestorApplication.tsx for why this renders
 * with none of the shell's usual chrome (no progress bar, no Back/
 * Continue: this is an endpoint, not another step to fill out).
 *
 * Always renders status="pending" - there's no real review process yet
 * that could have already reached "approved" or "rejected" the moment
 * someone lands here fresh off their own submission. The other two states
 * exist for the standalone /apply/status route (see
 * ApplicationStatusScreen's own comment), for a returning applicant whose
 * (still-stubbed) application has since been reviewed.
 */
export default function ConfirmationStep({ values }: StepProps<InvestorFormData>) {
  const callingCode = getCountryCallingCode(values.phoneCountry as CountryCode);
  const formattedPhone = `+${callingCode} ${values.phoneNumber}`;

  return (
    <ApplicationStatusScreen
      status="pending"
      nickname={values.nickname}
      phone={formattedPhone}
      purpose="invest with AUREX"
      applicationLabel="Investor Application"
      reapplyHref="/apply/investor"
    />
  );
}
