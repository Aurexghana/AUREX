"use client";

import { useState, type SVGProps } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { easing, hoverScale } from "@/lib/motion";
import { FormField, fieldClassName } from "@/components/apply/FormField";
import { isValidEmail } from "@/lib/validation";
import { EmailIcon } from "@/components/icons";
import { ApiError } from "@/lib/api/client";
import { requestPasswordReset } from "@/lib/passwordReset";

function SpinnerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The /forgot-password screen - reached from LoginForm's "Forgot password?"
 * link. Two phases, same AnimatePresence phase-switch pattern as LoginFlow
 * (role picker -> form): "request" (just an email field) and "sent" (a
 * confirmation screen, same circular-icon-badge treatment as
 * ApplicationStatusScreen's own StatusIcon).
 *
 * Mirrors account activation: the backend emails a single-use, high-entropy
 * token as a /reset-password?token=... link (see authService.forgotPassword)
 * rather than a code the applicant re-enters here - knowing someone's email
 * address alone was never supposed to be enough to start resetting their
 * password, only having the emailed link is.
 */
export default function ForgotPasswordFlow() {
  const [phase, setPhase] = useState<"request" | "sent">("request");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const error = !email.trim() ? "Enter your email address." : !isValidEmail(email) ? "Enter a valid email address." : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);
    if (error) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await requestPasswordReset(email.trim());
      setPhase("sent");
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await requestPasswordReset(email.trim());
      setResent(true);
      window.setTimeout(() => setResent(false), 3000);
    } catch {
      // Resend failures aren't worth a dedicated error state here - the
      // "Enter Code" link below still lets the applicant continue with
      // whichever code they already have.
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-5 border border-gold/20 bg-panel/40 p-6 backdrop-blur-2xl sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {phase === "request" ? (
          <motion.div
            key="request"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: easing.smooth }}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5 p-5">
              <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Forgot Password?</h1>
              <p className="font-sans text-sm text-cream-dim">
                Enter the email on your account and we&apos;ll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="p-5">
                <FormField label="Email Address" htmlFor="email" error={touched ? error : null}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder="you@example.com"
                    className={fieldClassName(touched && !!error)}
                  />
                </FormField>
              </div>

              {submitError && (
                <div className="mx-5 border border-[#f87171]/30 bg-[#f87171]/5 px-4 py-3">
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
                  {submitting ? <SpinnerIcon className="size-4 animate-spin" /> : "Send Reset Link"}
                </motion.button>
              </div>
            </form>

            <Link
              href="/login"
              className="mx-5 w-fit font-sans text-xs text-cream-dim underline-offset-4 transition-colors hover:text-gold-light hover:underline"
            >
              ← Back to Log In
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: easing.smooth }}
            className="flex flex-col items-center gap-6 p-5 text-center"
          >
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-bright">
              <EmailIcon className="size-7" />
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Check Your Email</h1>
              <p className="font-sans text-sm text-cream-dim sm:text-base">
                If an account exists for <span className="font-medium text-cream">{email}</span>, we&apos;ve sent a
                link to reset your password.
              </p>
              <p className="font-sans text-xs text-cream-dim/70">
                Didn&apos;t get it? Check your spam folder, or resend it below. The link expires in 30 minutes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void handleResend()}
              disabled={resending || resent}
              className="font-jakarta text-sm font-medium text-gold-bright underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-60"
            >
              {resending ? <SpinnerIcon className="size-4 animate-spin" /> : resent ? "Email resent ✓" : "Resend email"}
            </button>

            <Link
              href="/login"
              className="w-fit font-sans text-xs text-cream-dim underline-offset-4 transition-colors hover:text-gold-light hover:underline"
            >
              ← Back to Log In
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
