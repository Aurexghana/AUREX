"use client";

import { getCountryCallingCode, type CountryCode } from "libphonenumber-js/min";
import ApplicationStatusScreen from "@/components/apply/ApplicationStatusScreen";
import type { StepProps } from "@/components/apply/types";
import type { BusinessOwnerFormData } from "@/components/apply/business/types";

/**
 * Step 6 of 6 - "Confirmation". Reached only via ReviewSubmitStep's own
 * goToStep("confirmation") call right after a successful submission - see
 * its `fullScreen: true` in BusinessOwnerApplication.tsx for why this
 * renders with none of the shell's usual chrome.
 *
 * Always renders status="pending" - see the Investor flow's identical
 * ConfirmationStep.tsx for the same reasoning. The other two states exist
 * for the standalone /apply-business/status route, for a returning
 * applicant whose (still-stubbed) application has since been reviewed.
 */
export default function ConfirmationStep({ values }: StepProps<BusinessOwnerFormData>) {
  const callingCode = getCountryCallingCode(values.phoneCountry as CountryCode);
  const formattedPhone = `+${callingCode} ${values.phoneNumber}`;

  return (
    <ApplicationStatusScreen
      status="pending"
      nickname={values.nickname}
      phone={formattedPhone}
      purpose={`list ${values.businessName || "your business"} on AUREX`}
      applicationLabel="Business Owner Application"
      reapplyHref="/apply-business"
      dashboardHref="/business-dashboard"
    />
  );
}
