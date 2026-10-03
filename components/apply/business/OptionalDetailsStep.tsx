"use client";

import { useEffect } from "react";
import { REFERRAL_SOURCE_OPTIONS } from "@/lib/optionalDetails";
import { FormField } from "@/components/apply/FormField";
import CustomSelect from "@/components/apply/CustomSelect";
import type { StepProps } from "@/components/apply/types";
import type { BusinessOwnerFormData } from "@/components/apply/business/types";

/**
 * Step 4 of 6 - "Optional Details". The Business Owner flow's version of
 * this step only asks one thing (referral source) rather than the
 * Investor flow's three - everything else that flow puts here
 * (investment range, source of funds) doesn't apply to a business
 * applicant, who already gave their funding amount back in Step 1. Same
 * "always valid, reports itself skippable" shape as the Investor flow's
 * OptionalDetailsStep otherwise - see that file's own comment for the
 * reasoning behind the "Optional" badge and per-field "(optional)"
 * labeling instead of a separate visual treatment.
 */
export default function OptionalDetailsStep({ values, updateValues, onValidityChange }: StepProps<BusinessOwnerFormData>) {
  useEffect(() => {
    onValidityChange(true);
  }, [onValidityChange]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Optional Details</h1>
          <span className="inline-flex items-center rounded-full border border-grid-line px-2.5 py-0.5 font-jakarta text-[10px] font-medium uppercase tracking-wide text-cream-dim">
            Optional
          </span>
        </div>
        <p className="font-sans text-sm text-cream-dim sm:text-base">
          This detail is optional, but helps us understand how applicants find AUREX. Feel free to skip it.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <FormField label="How Did You Hear About AUREX? (optional)" htmlFor="referralSource">
          <CustomSelect
            id="referralSource"
            value={values.referralSource}
            onChange={(value) => updateValues({ referralSource: value })}
            options={REFERRAL_SOURCE_OPTIONS}
            placeholder="Select an option"
            triggerClassName="w-full"
          />
        </FormField>
      </div>
    </div>
  );
}
