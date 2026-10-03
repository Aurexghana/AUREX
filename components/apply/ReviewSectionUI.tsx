"use client";

import { type ReactNode, type SVGProps } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { hoverScale } from "@/lib/motion";

/**
 * Shared building blocks for a "Review & Submit" step - extracted once the
 * Business Owner flow needed the exact same section/badge/row/submit-
 * button chrome as the Investor flow's own Review & Submit step, with only
 * the actual field content differing between the two. Each flow's own
 * ReviewSubmitStep.tsx still owns its section layout and field values;
 * this file only owns the repeated visual/interaction pieces.
 */

export function getOptionLabel(options: { value: string; label: string }[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

function LockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M4 7V5a4 4 0 1 1 8 0v2m-9 0h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.5 8h13M8 1.5c1.7 1.8 2.6 4 2.6 6.5S9.7 12.7 8 14.5C6.3 12.7 5.4 10.5 5.4 8S6.3 3.3 8 1.5Z" stroke="currentColor" strokeWidth="1.3" />
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

export type Visibility = { label: string; tone: "private" | "public" };

export const PRIVATE: Visibility = { label: "Private · visible to Admin only", tone: "private" };
export const PUBLIC: Visibility = { label: "Public · visible to other members", tone: "public" };

function VisibilityBadge({ visibility }: { visibility: Visibility }) {
  const isPrivate = visibility.tone === "private";
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-jakarta text-[10px] font-medium uppercase tracking-wide ${
        isPrivate ? "border-grid-line text-cream-dim" : "border-gold/30 text-gold-bright"
      }`}
    >
      {isPrivate ? <LockIcon className="size-2.5" /> : <GlobeIcon className="size-2.5" />}
      {visibility.label}
    </span>
  );
}

export function ReviewSection({
  title,
  visibility,
  onEdit,
  children,
}: {
  title: string;
  visibility: Visibility;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border border-grid-line p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h2 className="font-jakarta text-sm font-semibold uppercase tracking-[1.2px] text-cream">{title}</h2>
          <VisibilityBadge visibility={visibility} />
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 font-jakarta text-xs font-medium text-gold-bright underline-offset-4 transition-colors hover:text-gold-light hover:underline"
        >
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

export function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <span className="font-sans text-xs text-cream-dim">{label}</span>
      <span className="font-sans text-sm text-cream sm:text-right">{value}</span>
    </div>
  );
}

export type SubmitState = "idle" | "submitting" | "error";

/**
 * The confirmation checkbox + inline error + Submit/Try Again button
 * every flow's Review & Submit step ends with. `confirmationText` is the
 * one thing that varies (the Investor flow mentions "my uploaded ID", the
 * Business Owner flow "my uploaded documents") - everything else about
 * this block's behavior is identical between flows.
 *
 * `onSaveAndExit`, if given, renders a "Save & Exit" link beside Submit -
 * this step hides the shell's own header copy of that action (see
 * StepDefinition.hideExitLink) and shows it here instead, right next to
 * the decision it's actually an alternative to, rather than up in the
 * header disconnected from it.
 */
export function ReviewSubmitFooter({
  confirmed,
  onConfirmedChange,
  submitState,
  submitError,
  onSubmit,
  confirmationText,
  onSaveAndExit,
}: {
  confirmed: boolean;
  onConfirmedChange: (checked: boolean) => void;
  submitState: SubmitState;
  submitError: string | null;
  onSubmit: () => void;
  confirmationText: string;
  onSaveAndExit?: () => void;
}) {
  return (
    <div className="flex flex-col gap-5 border-t border-grid-line pt-6">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => onConfirmedChange(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 cursor-pointer accent-gold"
        />
        <span className="font-sans text-sm leading-6 text-cream-dim">{confirmationText}</span>
      </label>

      {submitState === "error" && submitError && (
        <p role="alert" className="font-sans text-sm text-[#f87171]">
          {submitError}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <motion.button
          {...(confirmed && submitState !== "submitting" ? hoverScale : {})}
          type="button"
          onClick={onSubmit}
          disabled={!confirmed || submitState === "submitting"}
          className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3 font-jakarta text-sm font-medium text-amainblack transition-opacity disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:self-start"
        >
          {submitState === "submitting" ? (
            <SpinnerIcon className="size-4 animate-spin" />
          ) : submitState === "error" ? (
            "Try Again"
          ) : (
            "Submit Application"
          )}
        </motion.button>

        {onSaveAndExit && (
          <Link
            href="/"
            onClick={submitState === "submitting" ? (e) => e.preventDefault() : onSaveAndExit}
            aria-disabled={submitState === "submitting"}
            tabIndex={submitState === "submitting" ? -1 : undefined}
            className={`font-jakarta text-sm font-medium text-cream-dim transition-colors hover:text-gold-light ${
              submitState === "submitting" ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Save &amp; Exit
          </Link>
        )}
      </div>
    </div>
  );
}
