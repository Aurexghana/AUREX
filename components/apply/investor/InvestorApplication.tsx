"use client";

import MultiStepFormShell from "@/components/apply/MultiStepFormShell";
import IdentityContactStep from "@/components/apply/investor/IdentityContactStep";
import NicknameStep from "@/components/apply/investor/NicknameStep";
import IdUploadStep from "@/components/apply/investor/IdUploadStep";
import OptionalDetailsStep from "@/components/apply/investor/OptionalDetailsStep";
import ReviewSubmitStep from "@/components/apply/investor/ReviewSubmitStep";
import ConfirmationStep from "@/components/apply/investor/ConfirmationStep";
import { initialInvestorFormData, type InvestorFormData } from "@/components/apply/investor/types";
import type { StepDefinition } from "@/components/apply/types";

// The full 6-step flow: Identity & Contact -> Nickname -> ID Upload ->
// Optional Details -> Review & Submit -> Confirmation. Every step is now
// implemented; STEP_LABELS stays separate from STEPS below only because
// MultiStepFormShell's progress indicator needs each label independent of
// how many steps happen to be wired up (a holdover from when this flow was
// built one step at a time - harmless to keep now that it's complete).
const STEP_LABELS = [
  "Identity & Contact",
  "Nickname",
  "ID Upload",
  "Optional Details",
  "Review & Submit",
  "Confirmation",
];

const STEPS: StepDefinition<InvestorFormData>[] = [
  { id: "identity-contact", label: STEP_LABELS[0], render: (props) => <IdentityContactStep {...props} /> },
  { id: "nickname", label: STEP_LABELS[1], render: (props) => <NicknameStep {...props} /> },
  { id: "id-upload", label: STEP_LABELS[2], render: (props) => <IdUploadStep {...props} /> },
  {
    id: "optional-details",
    label: STEP_LABELS[3],
    // Every field on this step is optional - see OptionalDetailsStep's
    // own comment - so it's the one step in this flow that opts into the
    // shell's separate "Skip this step" action.
    skippable: true,
    render: (props) => <OptionalDetailsStep {...props} />,
  },
  {
    id: "review-submit",
    label: STEP_LABELS[4],
    // This step's primary action is an async submission with its own
    // loading/error states, not a simple "valid, so enable Continue" - see
    // its own comment for why it drives navigation itself via goToStep
    // instead.
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
    // Takes over the whole screen - see ConfirmationStep's and
    // ApplicationStatusScreen's own comments for why. Not marked
    // skippable/hideContinueButton since fullScreen bypasses the shell's
    // entire nav row (this step's own) regardless.
    fullScreen: true,
    render: (props) => <ConfirmationStep {...props} />,
  },
];

export default function InvestorApplication() {
  return (
    <MultiStepFormShell
      steps={STEPS}
      totalSteps={STEP_LABELS.length}
      initialValues={initialInvestorFormData}
      eyebrow="AUREX Investor Application"
      storageKey="aurex:investor-application"
    />
  );
}
