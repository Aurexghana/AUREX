/**
 * Shared form state for the 6-step Business Owner Application - parallel
 * to components/apply/investor/types.ts's InvestorFormData, following the
 * same shape/defaulting conventions (see that file's own comments for the
 * reasoning behind each), just with business-specific fields in place of
 * investor-specific ones.
 */
export type BusinessOwnerFormData = {
  /** The applicant's own real name (business owner/representative), not
   *  the business's name - admin-only, like the Investor flow's fullName. */
  fullName: string;
  /** Public - shown on Review & Submit as such, unlike fullName. */
  businessName: string;
  email: string;
  /** ISO 3166-1 alpha-2, e.g. "GH" - the phone number's dialing country. */
  phoneCountry: string;
  phoneNumber: string;
  /** ISO 3166-1 alpha-2 - where the business operates, not necessarily
   *  where the applicant personally resides (that distinction doesn't
   *  apply the same way it does for the Investor flow, so this flow only
   *  asks the one that actually matters for a business). */
  countryOfOperation: string;
  /** A few sentences: what the business does and what the funding is for
   *  - public, since it's the whole pitch other members would see. */
  businessDescription: string;
  /** One of lib/fundingRange.ts's own banded options. */
  fundingAmount: string;
  /** Step 2 - the public display name shown anywhere the applicant's
   *  identity appears on AUREX (members list, leaderboard, etc.). */
  nickname: string;
  /** Step 3 - held as a real File object in memory only, per the brief:
   *  no localStorage/sessionStorage. */
  idDocument: File | null;
  /** Step 3 - optional, one of lib/fileValidation.ts's ID_TYPE_OPTIONS
   *  values. */
  idType: string;
  /** Step 3 - the business's registration/incorporation document, a
   *  second and separate File field from idDocument. */
  businessRegistrationDocument: File | null;
  /** Step 4 - the one optional field in this flow; blank means skipped. */
  referralSource: string;
};

// Defaults phoneCountry to Ghana (AUREX's home market), matching the
// Investor flow's own default and reasoning.
export const initialBusinessOwnerFormData: BusinessOwnerFormData = {
  fullName: "",
  businessName: "",
  email: "",
  phoneCountry: "GH",
  phoneNumber: "",
  countryOfOperation: "",
  businessDescription: "",
  fundingAmount: "",
  nickname: "",
  idDocument: null,
  idType: "",
  businessRegistrationDocument: null,
  referralSource: "",
};
