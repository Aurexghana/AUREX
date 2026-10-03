/**
 * Option lists for Step 4 of the Investor Application ("Optional
 * Details") - see components/apply/investor/OptionalDetailsStep.tsx.
 * Every field built from these is genuinely optional; none of it is
 * validated, so this file is just data, not rules.
 */

export type SelectOption = { value: string; label: string };

// Deliberately bands, not a numeric free-text field - package choice
// (Core/Ventures) happens later, on the dashboard, not during
// application, so this is only meant to give a rough sense of intent.
export const INVESTMENT_RANGE_OPTIONS: SelectOption[] = [
  { value: "under-1000", label: "Under GHS 1,000" },
  { value: "1000-5000", label: "GHS 1,000 – 5,000" },
  { value: "5000-20000", label: "GHS 5,000 – 20,000" },
  { value: "20000-plus", label: "GHS 20,000+" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

export const SOURCE_OF_FUNDS_OPTIONS: SelectOption[] = [
  { value: "personal-savings", label: "Personal savings" },
  { value: "business-income", label: "Business income" },
  { value: "investment-returns", label: "Investment returns" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

export const REFERRAL_SOURCE_OPTIONS: SelectOption[] = [
  { value: "friend-or-family", label: "Friend or family" },
  { value: "social-media", label: "Social media" },
  { value: "search-engine", label: "Search engine" },
  { value: "aurex-event", label: "AUREX event" },
  { value: "other", label: "Other" },
];
