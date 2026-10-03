"use client";

import { useEffect, useState } from "react";
import { getNicknameFormatError, isNicknameAvailable, NICKNAME_MAX_LENGTH } from "@/lib/nickname";
import { FormField, fieldClassName } from "@/components/apply/FormField";
import NicknamePreview from "@/components/apply/NicknamePreview";
import type { StepProps } from "@/components/apply/types";
import type { InvestorFormData } from "@/components/apply/investor/types";

/**
 * Step 2 of 6 - "Nickname / Display Name". A single required field, but
 * with two things Step 1's fields don't need:
 *   - A live preview (a mock Leaderboard row) so the applicant sees
 *     exactly how the name they're typing will actually appear on the
 *     platform, before committing to it.
 *   - A two-part validity check: getNicknameFormatError runs synchronously
 *     on every keystroke (length, characters, impersonation guard);
 *     isNicknameAvailable is an async stub for the uniqueness check a real
 *     backend will eventually own (see lib/nickname.ts) - there isn't one
 *     yet, so it always resolves available, but the call site is already
 *     wired so swapping in a real API call later only means changing that
 *     function's body.
 */
export default function NicknameStep({ values, updateValues, onValidityChange }: StepProps<InvestorFormData>) {
  const [touched, setTouched] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const formatError = getNicknameFormatError(values.nickname);

  useEffect(() => {
    // Format already invalid - no point spending an availability check
    // (real or stubbed) on a nickname that can't be used anyway. Not
    // resetting `isAvailable` here is fine, not just lazy: both `isValid`
    // and `availabilityError` below already gate on `!formatError` first,
    // so a stale `isAvailable` value from before the format broke can
    // never leak into what the user sees.
    if (formatError) return;

    let cancelled = false;
    isNicknameAvailable(values.nickname).then((available) => {
      if (!cancelled) setIsAvailable(available);
    });
    return () => {
      cancelled = true;
    };
  }, [values.nickname, formatError]);

  const availabilityError = !formatError && isAvailable === false ? "That nickname is already taken." : null;
  const error = formatError ?? availabilityError;
  const isValid = !formatError && isAvailable === true;

  useEffect(() => {
    onValidityChange(isValid);
    // Only isValid should re-trigger this - see IdentityContactStep's
    // identical pattern/reasoning for why onValidityChange itself isn't a
    // dependency here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  const trimmed = values.nickname.trim();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Nickname / Display Name</h1>
        {/* Deliberately smaller/more muted than Step 1's intro paragraph -
            per the brief, this copy is context for the field below it,
            not the focus of the step. */}
        <p className="max-w-lg font-sans text-xs leading-5 text-cream-dim/80">
          Choose a nickname: this is what other members will see instead of your real name, anywhere your
          identity appears on AUREX (members list, leaderboard, etc.). Your real name stays private and is only
          visible to AUREX admin.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <FormField
          label="Nickname"
          htmlFor="nickname"
          error={touched ? error : null}
          hint={`${trimmed.length}/${NICKNAME_MAX_LENGTH} characters`}
        >
          <input
            id="nickname"
            name="nickname"
            type="text"
            required
            maxLength={NICKNAME_MAX_LENGTH}
            autoComplete="off"
            value={values.nickname}
            onChange={(e) => updateValues({ nickname: e.target.value })}
            onBlur={() => setTouched(true)}
            placeholder="GoldFalcon"
            className={fieldClassName(touched && !!error)}
          />
        </FormField>

        <div className="flex flex-col gap-2">
          <span className="font-jakarta text-xs font-medium uppercase tracking-[1.4px] text-cream-dim">
            Preview
          </span>
          <p className="font-sans text-xs text-cream-dim/70">This is how you&apos;ll appear on the Investor Leaderboard.</p>
          <NicknamePreview nickname={values.nickname} />
        </div>
      </div>
    </div>
  );
}
