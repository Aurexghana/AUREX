export type InvestorFormData = {
  fullName: string;
  email: string;
  /** ISO 3166-1 alpha-2, e.g. "GH" - the phone number's dialing country,
   *  independent of countryOfResidence (an applicant may live somewhere
   *  other than where their WhatsApp-reachable number is registered). */
  phoneCountry: string;
  phoneNumber: string;
  /** ISO 3166-1 alpha-2. */
  countryOfResidence: string;
  /** Step 2 - the public display name shown anywhere the applicant's
   *  identity appears on AUREX (members list, leaderboard, etc.); their
   *  real name (fullName, above) stays admin-only. */
  nickname: string;
  /** Step 3 - held as a real File object in memory only (per the brief:
   *  no localStorage/sessionStorage). Never serialized to the draft in
   *  localStorage, so this is intentionally the one field with no
   *  plain-string equivalent. */
  idDocument: File | null;
  /** Step 3 - optional, one of lib/idUpload.ts's ID_TYPE_OPTIONS values. */
  idType: string;
  /** Step 4 - every field below is genuinely optional; all three are one
   *  of lib/optionalDetails.ts's own option lists, blank meaning skipped. */
  investmentRange: string;
  sourceOfFunds: string;
  referralSource: string;
};

// Defaults phoneCountry to Ghana (AUREX's home market - see the "+233"
// numbers already in Footer.tsx/ContactInfo.tsx) as the most likely
// applicant, while every other country stays one selection away.
export const initialInvestorFormData: InvestorFormData = {
  fullName: "",
  email: "",
  phoneCountry: "GH",
  phoneNumber: "",
  countryOfResidence: "",
  nickname: "",
  idDocument: null,
  idType: "",
  investmentRange: "",
  sourceOfFunds: "",
  referralSource: "",
};
