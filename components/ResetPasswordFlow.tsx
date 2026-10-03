"use client";

import { useEffect, useState, type SVGProps } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { easing, hoverScale } from "@/lib/motion";
import { FormField, PasswordInput } from "@/components/apply/FormField";
import { MIN_PASSWORD_LENGTH, hasPasswordNumber, hasPasswordSymbol } from "@/lib/validation";
import { TrendFlatIcon } from "@/components/icons";
import { ApiError } from "@/lib/api/client";
import { resetPassword, validatePasswordResetToken } from "@/lib/passwordReset";

function CheckmarkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5 12.5 10 17.5 19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpinnerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function NeutralIcon() {
  return (
    <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-grid-line text-cream-dim">
      <TrendFlatIcon className="size-6" />
    </div>
  );
}

const PASSWORD_REQUIREMENTS: { key: string; label: string; test: (value: string) => boolean }[] = [
  { key: "length", label: `At least ${MIN_PASSWORD_LENGTH} characters`, test: (v) => v.length >= MIN_PASSWORD_LENGTH },
  { key: "number", label: "At least one number", test: hasPasswordNumber },
  { key: "symbol", label: "At least one symbol", test: hasPasswordSymbol },
];

function RequirementRow({ met, label }: { met: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-2 font-sans text-xs transition-colors ${met ? "text-[#4ade80]" : "text-cream-dim"}`}>
      <span
        className={`flex size-3.5 shrink-0 items-center justify-center rounded-full border transition-colors ${
          met ? "border-[#4ade80] bg-[#4ade80]/10" : "border-grid-line"
        }`}
      >
        {met && <CheckmarkIcon className="size-2" />}
      </span>
      {label}
    </li>
  );
}

type FieldName = "password" | "confirmPassword";
type Phase = "checking" | "expired" | "form" | "done";

/**
 * Standalone page for the link ForgotPasswordFlow emails - same token-based
 * shape as account activation (see ActivationFlow.tsx): the token is read
 * from the URL and validated before the form renders, and it alone
 * authorizes the reset, rather than the applicant typing in their own email
 * (which anyone who knows that email could otherwise do).
 *
 * Wrapped in <Suspense> by app/reset-password/page.tsx: useSearchParams
 * requires a Suspense boundary for static builds (same reason
 * DashboardTabs.tsx needs one - see that file's own comment).
 */
export default function ResetPasswordFlow() {
  const token = useSearchParams().get("token");

  const [phase, setPhase] = useState<Phase>("checking");
  const [checkError, setCheckError] = useState<string | null>(null);
  const [checkAttempt, setCheckAttempt] = useState(0);

  const [values, setValues] = useState({ password: "", confirmPassword: "" });
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({ password: false, confirmPassword: false });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    validatePasswordResetToken(token)
      .then((result) => {
        if (cancelled) return;
        setPhase(result.state === "valid" ? "form" : "expired");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setCheckError(
          error instanceof ApiError && error.status === 429
            ? "Too many attempts. Please wait a moment and try again."
            : "Something went wrong checking your reset link. Please try again.",
        );
        setPhase("expired");
      });
    return () => {
      cancelled = true;
    };
  }, [token, checkAttempt]);

  const requirementResults = PASSWORD_REQUIREMENTS.map((rule) => ({ ...rule, met: rule.test(values.password) }));
  const isPasswordValid = requirementResults.every((rule) => rule.met);

  const errors: Record<FieldName, string | null> = {
    password: !values.password
      ? "Enter a new password."
      : !isPasswordValid
        ? "Password doesn't meet the requirements below."
        : null,
    confirmPassword: !values.confirmPassword
      ? "Confirm your new password."
      : values.confirmPassword !== values.password
        ? "Passwords don't match."
        : null,
  };

  const markTouched = (field: FieldName) => setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });
    if (errors.password || errors.confirmPassword) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await resetPassword({ token: token ?? "", newPassword: values.password });
      setPhase("done");
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : "Something went wrong resetting your password. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {phase === "checking" && (
        <motion.div
          key="checking"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: easing.smooth }}
          className="flex w-full flex-col items-center gap-3 border border-gold/20 bg-panel/40 p-10 text-center backdrop-blur-2xl"
        >
          <p className="font-sans text-sm text-cream-dim">Checking your reset link…</p>
        </motion.div>
      )}

      {phase === "expired" && (
        <motion.div
          key="expired"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: easing.smooth }}
          className="flex w-full flex-col items-center gap-6 border border-gold/20 bg-panel/40 p-6 text-center backdrop-blur-2xl sm:p-8"
        >
          <NeutralIcon />

          <div className="flex flex-col gap-3">
            <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">
              {checkError ? "Something Went Wrong" : "Link Expired"}
            </h1>
            <p role={checkError ? "alert" : undefined} className="font-sans text-sm text-cream-dim sm:text-base">
              {checkError ?? "This reset link has expired or has already been used."}
            </p>
          </div>

          <Link
            href="/forgot-password"
            className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3.5 font-jakarta text-sm font-medium text-amainblack transition-opacity hover:opacity-90"
          >
            Request a New Link
          </Link>

          {checkError && (
            <button
              type="button"
              onClick={() => {
                setPhase("checking");
                setCheckError(null);
                setCheckAttempt((n) => n + 1);
              }}
              className="font-sans text-xs text-cream-dim underline-offset-4 transition-colors hover:text-gold-light hover:underline"
            >
              Try Again
            </button>
          )}

          <Link
            href="/login"
            className="w-fit font-sans text-xs text-cream-dim underline-offset-4 transition-colors hover:text-gold-light hover:underline"
          >
            ← Back to Log In
          </Link>
        </motion.div>
      )}

      {phase === "form" && (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: easing.smooth }}
          className="flex w-full flex-col gap-5 border border-gold/20 bg-panel/40 p-6 backdrop-blur-2xl sm:p-8"
        >
          <div className="flex flex-col gap-1.5 p-5">
            <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Reset Password</h1>
            <p className="font-sans text-sm text-cream-dim">Choose a new password for your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 p-5">
              <FormField label="New Password" htmlFor="password" error={touched.password ? errors.password : null}>
                <PasswordInput
                  id="password"
                  name="password"
                  required
                  autoComplete="new-password"
                  value={values.password}
                  onChange={(value) => setValues((v) => ({ ...v, password: value }))}
                  onBlur={() => markTouched("password")}
                  hasError={touched.password && !!errors.password}
                />
              </FormField>

              <ul className="-mt-2 flex flex-col gap-1.5 pl-1">
                {requirementResults.map((rule) => (
                  <RequirementRow key={rule.key} met={rule.met} label={rule.label} />
                ))}
              </ul>

              <FormField
                label="Confirm New Password"
                htmlFor="confirmPassword"
                error={touched.confirmPassword ? errors.confirmPassword : null}
              >
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  autoComplete="new-password"
                  value={values.confirmPassword}
                  onChange={(value) => setValues((v) => ({ ...v, confirmPassword: value }))}
                  onBlur={() => markTouched("confirmPassword")}
                  hasError={touched.confirmPassword && !!errors.confirmPassword}
                />
              </FormField>
            </div>

            {submitError && (
              <div className="mx-5 flex flex-wrap items-center justify-between gap-3 border border-[#f87171]/30 bg-[#f87171]/5 px-4 py-3">
                <p role="alert" className="font-sans text-xs text-[#f87171]">
                  {submitError}
                </p>
              </div>
            )}

            <div className="p-5">
              <motion.button
                {...(submitting ? {} : hoverScale)}
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3.5 font-jakarta text-sm font-medium text-amainblack transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? <SpinnerIcon className="size-4 animate-spin" /> : "Reset Password"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {phase === "done" && (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: easing.smooth }}
          className="flex w-full flex-col items-center gap-6 border border-gold/20 bg-panel/40 p-6 text-center backdrop-blur-2xl sm:p-8"
        >
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-bright">
            <CheckmarkIcon className="size-8" />
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Password Reset</h1>
            <p className="font-sans text-sm text-cream-dim sm:text-base">
              Your password has been reset. You can now log in with your new password.
            </p>
          </div>

          <Link
            href="/login"
            className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3.5 font-jakarta text-sm font-medium text-amainblack transition-opacity hover:opacity-90"
          >
            Log In
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
