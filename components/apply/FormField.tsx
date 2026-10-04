"use client";

import { useState, type ReactNode } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/icons";

/**
 * Shared field chrome for every step's inputs - extracted from
 * IdentityContactStep (Step 1) so Step 2 (and any future step) doesn't
 * re-implement the same label/input/error layout. Same visual language as
 * the rest of the site's forms (ContactForm's border/bg/padding/text),
 * with an error variant on top.
 *
 * #f87171 isn't a new color introduced for this: it's the exact
 * "declining" red Leaderboard.tsx already uses for a negative rank
 * change, reused here so the app doesn't end up with two reds for the
 * same "something's wrong" idea.
 *
 * `flex items-center` is part of the shared base (not just something
 * CustomSelect adds on top): a plain `<input>` centers its own text
 * vertically by default, but CustomSelect's trigger is a `<button>`
 * wrapping a `<span>`, which without an explicit flex box model can end up
 * a hair taller/shorter than a sibling input depending on the browser's
 * own button/line-height defaults - the exact "dropdown isn't the same
 * height as other fields" drift this exists to rule out. Harmless on a
 * plain input (no children to lay out), so every field sharing this
 * function is guaranteed the same box model, not just the same paint.
 */
export function fieldClassName(hasError: boolean, extra = "") {
  return [
    "flex items-center border bg-ink-light/20 px-4 py-3 font-sans text-sm text-cream placeholder:text-cream-dim/35 outline-none transition-colors light:bg-white/60",
    hasError ? "border-[#f87171] focus:border-[#f87171]" : "border-grid-line focus:border-gold",
    extra,
  ].join(" ");
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  action,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string | null;
  hint?: string;
  /** Optional inline label-row action - e.g. LoginForm's "Forgot
   *  password?" link, right-aligned on the same row as the label rather
   *  than floating elsewhere in the form. */
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="font-jakarta text-xs font-medium uppercase tracking-[1.4px] text-cream-dim">
          {label}
        </label>
        {action}
      </div>
      {children}
      {error ? (
        <p role="alert" className="font-sans text-xs text-[#f87171]">
          {error}
        </p>
      ) : hint ? (
        <p className="font-sans text-xs text-cream-dim/70">{hint}</p>
      ) : null}
    </div>
  );
}

/**
 * A password `<input>` with a show/hide toggle - every password field in
 * the app (Login, Reset Password, and Create Your Account/activation) goes
 * through this instead of a raw `<input type="password">`, so the control
 * looks and behaves identically everywhere it appears. Wraps fieldClassName
 * exactly like a plain input would, plus room for the toggle button.
 *
 * The toggle is type="button" (never submits the form) and swaps the
 * input's own `type` between "password"/"text" - not a second shadow input
 * or a CSS trick, so paste/autofill/password managers keep working
 * normally regardless of which state it's in.
 */
export function PasswordInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder = "••••••••",
  autoComplete,
  required,
  hasError,
}: {
  id: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  hasError?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={fieldClassName(!!hasError, "w-full pr-11")}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center justify-center text-cream-dim transition-colors hover:text-gold-bright"
      >
        {visible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
      </button>
    </div>
  );
}
