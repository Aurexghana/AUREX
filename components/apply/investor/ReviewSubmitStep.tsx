"use client";

import { useEffect, useState } from "react";
import { getCountryCallingCode, type CountryCode } from "libphonenumber-js/min";
import { getCountryList, type Country } from "@/lib/countries";
import { ID_TYPE_OPTIONS, formatFileSize } from "@/lib/idUpload";
import { INVESTMENT_RANGE_OPTIONS, SOURCE_OF_FUNDS_OPTIONS, REFERRAL_SOURCE_OPTIONS } from "@/lib/optionalDetails";
import { submitInvestorApplication } from "@/lib/investorApplication";
import { DocumentIcon } from "@/components/icons";
import NicknamePreview from "@/components/apply/NicknamePreview";
import {
  ReviewSection,
  ReviewRow,
  ReviewSubmitFooter,
  getOptionLabel,
  PRIVATE,
  PUBLIC,
  type SubmitState,
} from "@/components/apply/ReviewSectionUI";
import type { StepProps } from "@/components/apply/types";
import type { InvestorFormData } from "@/components/apply/investor/types";

/**
 * Step 5 of 6 - "Review & Submit". Read-only recap of every prior step's
 * data, grouped into the same sections those steps own, each with its own
 * "Edit" link back to that step (via goToStep - see StepProps) rather than
 * a single generic "Edit" that dumps the applicant back at Step 1.
 *
 * Unlike every step before it, this one doesn't drive the shell's shared
 * Continue button - see its `hideContinueButton: true` in
 * InvestorApplication.tsx. Submission is asynchronous with its own
 * loading/error states that a plain "is this step valid" boolean can't
 * represent, so this step renders its own Submit action and calls
 * goToStep directly on success instead.
 *
 * The section/badge/row/submit-button chrome itself lives in
 * components/apply/ReviewSectionUI.tsx, shared with the Business Owner
 * flow's own Review & Submit step - this file only owns which fields go in
 * which section.
 */
export default function ReviewSubmitStep({
  values,
  goToStep,
  clearSavedProgress,
  saveAndExit,
}: StepProps<InvestorFormData>) {
  // Country names come from Intl.DisplayNames (see lib/countries.ts),
  // which can disagree between Node's SSR pass and the browser's own ICU
  // data for a handful of regions - same hydration-mismatch reasoning as
  // IdentityContactStep, and the same fix: compute it client-side-only in
  // an effect rather than during render.
  const [countryList, setCountryList] = useState<Country[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCountryList(getCountryList());
  }, []);

  const [confirmed, setConfirmed] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const countryName = countryList.find((c) => c.code === values.countryOfResidence)?.name ?? values.countryOfResidence;
  // getCountryCallingCode is static library data, not Intl-derived - safe
  // to call directly during render, unlike the country-name lookup above.
  const callingCode = getCountryCallingCode(values.phoneCountry as CountryCode);
  const formattedPhone = `+${callingCode} ${values.phoneNumber}`;

  const hasOptionalDetails = Boolean(values.investmentRange || values.sourceOfFunds || values.referralSource);

  const handleSubmit = async () => {
    setSubmitState("submitting");
    setSubmitError(null);
    const result = await submitInvestorApplication(values);
    if (result.success) {
      // The application is submitted - there's no "resume this draft"
      // concept anymore, so any earlier Save & Exit progress shouldn't
      // resurface if this applicant (or a rejected one, via Reapply) ever
      // returns to /apply/investor again.
      clearSavedProgress();
      goToStep("confirmation");
      return;
    }
    setSubmitState("error");
    setSubmitError(result.error);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Review &amp; Submit</h1>
        <p className="font-sans text-sm text-cream-dim sm:text-base">
          This is your last chance to check everything before it goes to AUREX for review. Use Edit on any section
          to change something; nothing else you&apos;ve entered will be lost.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <ReviewSection title="Identity & Contact" visibility={PRIVATE} onEdit={() => goToStep("identity-contact")}>
          <div className="flex flex-col gap-3">
            <ReviewRow label="Full Legal Name" value={values.fullName} />
            <ReviewRow label="Email" value={values.email} />
            <ReviewRow label="Phone" value={formattedPhone} />
            <ReviewRow label="Country of Residence" value={countryName} />
          </div>
        </ReviewSection>

        <ReviewSection title="Nickname" visibility={PUBLIC} onEdit={() => goToStep("nickname")}>
          <NicknamePreview nickname={values.nickname} bare />
        </ReviewSection>

        <ReviewSection title="ID Document" visibility={PRIVATE} onEdit={() => goToStep("id-upload")}>
          {/* Confirms a file is attached without re-rendering the document
              itself - a generic file-type icon, never the actual image/PDF
              content, regardless of what was uploaded. */}
          <div className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center border border-gold/20 bg-ink-light/50 text-gold-muted">
              <DocumentIcon className="size-5" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate font-jakarta text-sm font-medium text-cream">
                {values.idDocument?.name ?? "No file attached"}
              </span>
              <span className="font-sans text-xs text-cream-dim">
                {values.idDocument ? formatFileSize(values.idDocument.size) : ""}
                {values.idDocument && values.idType ? " · " : ""}
                {values.idType ? getOptionLabel(ID_TYPE_OPTIONS, values.idType) : ""}
              </span>
            </div>
          </div>
        </ReviewSection>

        <ReviewSection title="Optional Details" visibility={PRIVATE} onEdit={() => goToStep("optional-details")}>
          {hasOptionalDetails ? (
            <div className="flex flex-col gap-3">
              <ReviewRow
                label="Intended Investment Range"
                value={values.investmentRange ? getOptionLabel(INVESTMENT_RANGE_OPTIONS, values.investmentRange) : "Not provided"}
              />
              <ReviewRow
                label="Source of Funds"
                value={values.sourceOfFunds ? getOptionLabel(SOURCE_OF_FUNDS_OPTIONS, values.sourceOfFunds) : "Not provided"}
              />
              <ReviewRow
                label="How Did You Hear About AUREX?"
                value={values.referralSource ? getOptionLabel(REFERRAL_SOURCE_OPTIONS, values.referralSource) : "Not provided"}
              />
            </div>
          ) : (
            <p className="font-sans text-sm italic text-cream-dim">No optional details were provided.</p>
          )}
        </ReviewSection>
      </div>

      <ReviewSubmitFooter
        confirmed={confirmed}
        onConfirmedChange={setConfirmed}
        submitState={submitState}
        submitError={submitError}
        onSubmit={handleSubmit}
        confirmationText="I confirm the information above is accurate and I consent to AUREX reviewing my application, including my uploaded ID."
        onSaveAndExit={saveAndExit}
      />
    </div>
  );
}
