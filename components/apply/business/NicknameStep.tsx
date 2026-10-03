"use client";

import { useEffect, useState } from "react";
import { getNicknameFormatError, isNicknameAvailable, NICKNAME_MAX_LENGTH } from "@/lib/nickname";
import { FormField, fieldClassName } from "@/components/apply/FormField";
import NicknamePreview from "@/components/apply/NicknamePreview";
import type { StepProps } from "@/components/apply/types";
import type { BusinessOwnerFormData } from "@/components/apply/business/types";

/**
 * Step 2 of 6 - "Nickname / Display Name". Identical behavior to the
 * Investor flow's own Nickname step (same lib/nickname.ts format rules,
 * same isNicknameAvailable stub, same NicknamePreview) - see that file's
 * own comment for the full reasoning. The only real difference is this
 * step's intro copy, which mentions the business name alongside the
 * applicant's real name per the brief, since here there are two identities
 * (the person and the business) this nickname stands in for.
 */
export default function NicknameStep({ values, updateValues, onValidityChange }: StepProps<BusinessOwnerFormData>) {
  const [touched, setTouched] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const formatError = getNicknameFormatError(values.nickname);

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  const trimmed = values.nickname.trim();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Nickname / Display Name</h1>
        <p className="max-w-lg font-sans text-xs leading-5 text-cream-dim/80">
          This is what other members will see instead of your real name or business name, anywhere your identity
          appears on AUREX (members list, leaderboard, etc.). Your real name stays private and is only visible to
          AUREX admin.
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
            placeholder="AcmeFoods"
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
