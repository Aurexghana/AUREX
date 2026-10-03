"use client";

import { useEffect } from "react";
import { ID_TYPE_OPTIONS } from "@/lib/idUpload";
import { FormField } from "@/components/apply/FormField";
import CustomSelect from "@/components/apply/CustomSelect";
import DocumentUploadField from "@/components/apply/DocumentUploadField";
import { SecurityIcon } from "@/components/icons";
import type { StepProps } from "@/components/apply/types";
import type { InvestorFormData } from "@/components/apply/investor/types";

/**
 * Step 3 of 6 - "ID Upload". The one step in this flow whose value is a
 * real File object (per the brief: held in memory only, no
 * localStorage/sessionStorage).
 *
 * The drag-drop/preview/remove field itself is
 * components/apply/DocumentUploadField.tsx, shared with the Business Owner
 * flow's own (two) document fields - this step just supplies the ID-
 * specific label/copy and owns the value in shared form state.
 */
export default function IdUploadStep({ values, updateValues, onValidityChange }: StepProps<InvestorFormData>) {
  const isValid = values.idDocument !== null;

  useEffect(() => {
    onValidityChange(isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">ID Upload</h1>
        {/* Trust messaging kept at normal size (not de-emphasized the way
            Step 2's context line is) - per the brief, this is the step
            applicants tend to hesitate on, so it stays visible rather
            than reading as fine print. */}
        <p className="flex items-start gap-2 font-sans text-sm leading-6 text-cream-dim sm:text-base">
          <SecurityIcon className="mt-0.5 size-4 shrink-0 text-gold-muted" />
          <span>
            Upload a government-issued ID for identity verification. This document is only visible to AUREX admin
            as part of reviewing your application, and is never shown publicly or to other members.
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <DocumentUploadField
          id="idDocument"
          label="Government-Issued ID"
          hint="JPG, PNG, or PDF · up to 10MB · on a phone, your camera is usually offered as an option too"
          file={values.idDocument}
          onFileSelected={(file) => updateValues({ idDocument: file })}
          onRemove={() => updateValues({ idDocument: null })}
        />

        <FormField label="ID Type (optional)" htmlFor="idType">
          <CustomSelect
            id="idType"
            value={values.idType}
            onChange={(value) => updateValues({ idType: value })}
            options={ID_TYPE_OPTIONS}
            placeholder="Select ID type"
            triggerClassName="w-full"
          />
        </FormField>
      </div>
    </div>
  );
}
