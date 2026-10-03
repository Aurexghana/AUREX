/**
 * Nickname rules for Step 2 of the Investor Application (see
 * components/apply/investor/NicknameStep.tsx). Split into two concerns:
 *   - getNicknameFormatError: synchronous, client-only checks (length,
 *     allowed characters, impersonation) - real validation today.
 *   - isNicknameAvailable: a stub for the uniqueness check that needs a
 *     real backend, which doesn't exist yet at this stage of the build.
 */

export const NICKNAME_MIN_LENGTH = 3;
export const NICKNAME_MAX_LENGTH = 20;

// Letters (Unicode-aware - nicknames aren't limited to ASCII names),
// numbers, spaces, and a small set of basic punctuation.
const ALLOWED_CHARACTERS_PATTERN = /^[\p{L}\p{N} '_.-]+$/u;

// Blocks obvious attempts to impersonate AUREX staff or the platform
// itself (e.g. "Admin", "AUREX Support", "A.d.m.i.n", "aurex_official").
// Stripping everything but letters/digits and lowercasing before matching
// means separators or case tricks don't slip past a plain substring check.
const RESERVED_SUBSTRINGS = ["admin", "aurex"];

function normalizeForReservedCheck(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Returns a user-facing error message, or null if the nickname's format is
 * valid. Doesn't check availability - see isNicknameAvailable for that.
 */
export function getNicknameFormatError(nickname: string): string | null {
  const trimmed = nickname.trim();

  if (!trimmed) return "Enter a nickname.";

  if (trimmed.length < NICKNAME_MIN_LENGTH || trimmed.length > NICKNAME_MAX_LENGTH) {
    return `Nickname must be ${NICKNAME_MIN_LENGTH}–${NICKNAME_MAX_LENGTH} characters.`;
  }

  if (!ALLOWED_CHARACTERS_PATTERN.test(trimmed)) {
    return "Only letters, numbers, spaces, and basic punctuation ( ' _ . - ) are allowed.";
  }

  if (RESERVED_SUBSTRINGS.some((word) => normalizeForReservedCheck(trimmed).includes(word))) {
    return "That nickname isn't available: it can't reference AUREX or Admin.";
  }

  return null;
}

/**
 * Stub - there's no backend to check real uniqueness against yet (see the
 * brief for Step 2). Always resolves available, but is already async and
 * already the single call site NicknameStep uses for this check, so
 * swapping in a real API call later means changing only this function's
 * body, not anything that calls it.
 */
export async function isNicknameAvailable(nickname: string): Promise<boolean> {
  void nickname; // unused until a real API call replaces this body
  return true;
}
