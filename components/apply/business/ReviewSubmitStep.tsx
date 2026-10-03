"use client";

import { useEffect, useState } from "react";
import { getCountryCallingCode, type CountryCode } from "libphonenumber-js/min";
import { getCountryList, type Country } from "@/lib/countries";
import { ID_TYPE_OPTIONS, formatFileSize } from "@/lib/businessDocuments";
import { FUNDING_RANGE_OPTIONS } from "@/lib/fundingRange";
import { REFERRAL_SOURCE_OPTIONS } from "@/lib/optionalDetails";
import { submitBusinessOwnerApplication } from "@/lib/businessOwnerApplication";
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
import type { BusinessOwnerFormData } from "@/components/apply/business/types";

// One "file is attached" row, reused for both documents in the Documents
// section below - confirms a file is attached without re-rendering the
// document itself, same reasoning as the Investor flow's own ID Document
// review section.
function DocumentRow({ label, file, idType }: { label: string; file: File | null; idType?: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex size-11 shrink-0 items-center justify-center border border-gold/20 bg-ink-light/50 text-gold-muted">
        <DocumentIcon className="size-5" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-sans text-xs text-cream-dim">{label}</span>
        <span className="truncate font-jakarta text-sm font-medium text-cream">{file?.name ?? "No file attached"}</span>
        <span className="font-sans text-xs text-cream-dim">
          {file ? formatFileSize(file.size) : ""}
          {file && idType ? " · " : ""}
          {idType ? getOptionLabel(ID_TYPE_OPTIONS, idType) : ""}
        </span>
      </div>
    </div>
  );
}

/**
 * Step 5 of 6 - "Review & Submit". Same shape as the Investor flow's own
 * Review & Submit step (see that file's own comment for the shared
 * section/badge/row/submit-button chrome in
 * components/apply/ReviewSectionUI.tsx) - the only real difference is
 * which fields go in which section, and that this flow splits its single
 * combined Step 1 ("Applicant & Business Details") into two review
 * sections with different visibility: the applicant's own identity/
 * contact details are admin-only, but the business's own name/pitch/
 * funding ask are public - a prospective investor browsing listed
 * businesses needs to see exactly those, unlike an individual investor
 * applicant's private contact information.
 */
export default function ReviewSubmitStep({
  values,
  goToStep,
  clearSavedProgress,
  saveAndExit,
}: StepProps<BusinessOwnerFormData>) {
  const [countryList, setCountryList] = useState<Country[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCountryList(getCountryList());
  }, []);

  const [confirmed, setConfirmed] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const countryName = countryList.find((c) => c.code === values.countryOfOperation)?.name ?? values.countryOfOperation;
  const callingCode = getCountryCallingCode(values.phoneCountry as CountryCode);
  const formattedPhone = `+${callingCode} ${values.phoneNumber}`;

  const handleSubmit = async () => {
    setSubmitState("submitting");
    setSubmitError(null);
    const result = await submitBusinessOwnerApplication(values);
    if (result.success) {
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
        <ReviewSection title="Applicant Details" visibility={PRIVATE} onEdit={() => goToStep("applicant-business")}>
          <div className="flex flex-col gap-3">
            <ReviewRow label="Full Legal Name" value={values.fullName} />
            <ReviewRow label="Email" value={values.email} />
            <ReviewRow label="Phone" value={formattedPhone} />
          </div>
        </ReviewSection>

        <ReviewSection title="Business Details" visibility={PUBLIC} onEdit={() => goToStep("applicant-business")}>
          <div className="flex flex-col gap-3">
            <ReviewRow label="Business Name" value={values.businessName} />
            <ReviewRow label="Country of Operation" value={countryName} />
            <ReviewRow
              label="Funding Sought"
              value={getOptionLabel(FUNDING_RANGE_OPTIONS, values.fundingAmount)}
            />
            <div className="flex flex-col gap-1">
              <span className="font-sans text-xs text-cream-dim">Business Description &amp; Funding Purpose</span>
              <p className="font-sans text-sm text-cream">{values.businessDescription}</p>
            </div>
          </div>
        </ReviewSection>

        <ReviewSection title="Nickname" visibility={PUBLIC} onEdit={() => goToStep("nickname")}>
          <NicknamePreview nickname={values.nickname} bare />
        </ReviewSection>

        <ReviewSection title="Documents" visibility={PRIVATE} onEdit={() => goToStep("document-upload")}>
          <div className="flex flex-col gap-4">
            <DocumentRow label="Government-Issued ID" file={values.idDocument} idType={values.idType} />
            <div className="border-t border-grid-line" />
            <DocumentRow label="Business Registration Document" file={values.businessRegistrationDocument} />
          </div>
        </ReviewSection>

        <ReviewSection title="Optional Details" visibility={PRIVATE} onEdit={() => goToStep("optional-details")}>
          {values.referralSource ? (
            <ReviewRow
              label="How Did You Hear About AUREX?"
              value={getOptionLabel(REFERRAL_SOURCE_OPTIONS, values.referralSource)}
            />
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
        confirmationText="I confirm the information above is accurate and I consent to AUREX reviewing my application, including my uploaded documents."
        onSaveAndExit={saveAndExit}
      />
    </div>
  );
}
