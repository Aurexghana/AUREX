/**
 * Small shared validators for application-flow forms (see
 * components/apply/). Kept minimal and dependency-free - phone number
 * validation is the one case that genuinely needs a real library (see
 * components/apply/investor/IdentityContactStep.tsx's use of
 * libphonenumber-js), everything else here is simple enough to hand-roll.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

/** Used by the Reset Password flow (components/ResetPasswordFlow.tsx) -
 *  no real backend to enforce a policy server-side yet, so this is the
 *  one rule enforced client-side. */
export const MIN_PASSWORD_LENGTH = 8;

export function isValidPassword(value: string): boolean {
  return value.length >= MIN_PASSWORD_LENGTH;
}

/** Used by the account activation flow (components/ActivationFlow.tsx),
 *  which shows each password rule as its own live-updating checklist item
 *  (length here, this one) rather than one bulk pass/fail - kept separate
 *  from isValidPassword above so a call site can test rules individually. */
export function hasPasswordNumber(value: string): boolean {
  return /\d/.test(value);
}

/** Same per-rule checklist use as hasPasswordNumber above. */
export function hasPasswordSymbol(value: string): boolean {
  return /[^A-Za-z0-9]/.test(value);
}
