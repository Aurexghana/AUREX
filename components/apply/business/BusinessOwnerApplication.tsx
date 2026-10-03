"use client";

import MultiStepFormShell from "@/components/apply/MultiStepFormShell";
import ApplicantBusinessStep from "@/components/apply/business/ApplicantBusinessStep";
import NicknameStep from "@/components/apply/business/NicknameStep";
import DocumentUploadStep from "@/components/apply/business/DocumentUploadStep";
import OptionalDetailsStep from "@/components/apply/business/OptionalDetailsStep";
import ReviewSubmitStep from "@/components/apply/business/ReviewSubmitStep";
import ConfirmationStep from "@/components/apply/business/ConfirmationStep";
import { initialBusinessOwnerFormData, type BusinessOwnerFormData } from "@/components/apply/business/types";
import type { StepDefinition } from "@/components/apply/types";

// Parallel to components/apply/investor/InvestorApplication.tsx - same
// shell, same 6-step shape, business-specific step components. See that
// file's own comments for the reasoning behind each shell-level flag
// (skippable, hideContinueButton, fullScreen) reused identically here.
const STEP_LABELS = [
  "Applicant & Business",
  "Nickname",
  "Documents",
  "Optional Details",
  "Review & Submit",
  "Confirmation",
];

const STEPS: StepDefinition<BusinessOwnerFormData>[] = [
  { id: "applicant-business", label: STEP_LABELS[0], render: (props) => <ApplicantBusinessStep {...props} /> },
  { id: "nickname", label: STEP_LABELS[1], render: (props) => <NicknameStep {...props} /> },
  { id: "document-upload", label: STEP_LABELS[2], render: (props) => <DocumentUploadStep {...props} /> },
  {
    id: "optional-details",
    label: STEP_LABELS[3],
    skippable: true,
    render: (props) => <OptionalDetailsStep {...props} />,
  },
  {
    id: "review-submit",
    label: STEP_LABELS[4],
    hideContinueButton: true,
    // This step renders its own "Save & Exit" beside its Submit button
    // (see ReviewSubmitFooter's onSaveAndExit) - hides the shell's header
    // copy so there isn't a second, disconnected one up top.
    hideExitLink: true,
    render: (props) => <ReviewSubmitStep {...props} />,
  },
  {
    id: "confirmation",
    label: STEP_LABELS[5],
    fullScreen: true,
    render: (props) => <ConfirmationStep {...props} />,
  },
];

export default function BusinessOwnerApplication() {
  return (
    <MultiStepFormShell
      steps={STEPS}
      totalSteps={STEP_LABELS.length}
      initialValues={initialBusinessOwnerFormData}
      eyebrow="AUREX Business Owner Application"
      storageKey="aurex:business-owner-application"
    />
  );
}
