"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { easing, hoverScale } from "@/lib/motion";
import BrandMark from "@/components/BrandMark";
import type { StepDefinition } from "@/components/apply/types";

/**
 * Generic shell for any multi-step application flow (currently just the
 * Investor Application - see components/apply/investor/ - but built so a
 * future Business Owner application can reuse it with its own step
 * components and its own TValues shape, rather than forking this file).
 *
 * Responsibilities split cleanly from each step:
 *   - This shell owns `values` (the merged form data) and `stepIndex`, so
 *     data survives moving back and forth between steps, and renders the
 *     progress indicator + Back/Continue chrome.
 *   - Each step owns its own fields' rendering, inline errors, and
 *     validation, reporting up only a single "am I valid right now?"
 *     boolean via onValidityChange - the shell never inspects field
 *     values itself.
 *
 * `steps` is whatever's actually implemented so far (currently 4, for the
 * investor flow); `totalSteps` is the true length of the intended flow (6)
 * so the progress bar/"Step X of 6" text is correct even while most of it
 * is still unbuilt - see the current placeholder step's own comment.
 *
 * `storageKey`, if given, opts this flow into "Save & Exit": clicking Exit
 * persists `values`/`stepIndex` to localStorage under that key (localStorage,
 * not sessionStorage, since the whole point is surviving a closed tab/
 * browser, not just this visit), and mounting the shell restores it. It's a
 * prop rather than baked into this file so a future flow (e.g. a Business
 * Owner application) can pick its own key, or opt out entirely by omitting
 * it - this file still knows nothing about any particular flow's fields.
 *
 * See StepDefinition's own comments for `fullScreen` (a step that takes
 * over the whole screen, bypassing this shell's chrome entirely) and
 * StepProps' for `clearSavedProgress` (letting a step retire saved
 * progress once it's no longer a draft worth resuming).
 */
export default function MultiStepFormShell<TValues>({
  steps,
  totalSteps,
  initialValues,
  eyebrow,
  storageKey,
}: {
  steps: StepDefinition<TValues>[];
  totalSteps: number;
  initialValues: TValues;
  eyebrow?: string;
  storageKey?: string;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<TValues>(initialValues);

  // Restore saved progress, if any. This has to run client-side-only in an
  // effect rather than as a lazy useState initializer - localStorage isn't
  // available during SSR (this component still renders server-side like
  // any other client component), so reading it during render would throw
  // there. Same reasoning IdentityContactStep already uses for its
  // Intl-derived lists: render as if there's nothing saved, then let this
  // one-time effect fill in the real state right after mount.
  useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const saved = JSON.parse(raw) as { stepIndex?: number; values?: Partial<TValues> };
      if (saved.values) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setValues((prev) => ({ ...prev, ...saved.values }));
      }
      if (typeof saved.stepIndex === "number") {
        setStepIndex(Math.min(Math.max(saved.stepIndex, 0), steps.length - 1));
      }
    } catch {
      // Corrupted JSON or storage unavailable (private browsing, quota,
      // etc.) - fall back to a fresh application rather than blocking the
      // page over a best-effort convenience feature.
    }
    // Deliberately run once, right after mount, regardless of `steps`
    // possibly growing a reference identity - restoring saved progress
    // isn't something that should re-fire as this flow's own props change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);
  // Reset to false on every navigation (see goBack/goNext) rather than
  // left holding the previous step's answer - the newly-entered step
  // reports its own real validity a moment later via onValidityChange, so
  // "Continue" is never briefly enabled/disabled based on stale state.
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);

  const currentStep = steps[stepIndex];
  const isFirstStep = stepIndex === 0;
  // Bounds where the actually-implemented steps run out - distinct from
  // "the last step of the real flow" (totalSteps), which may still be
  // further ahead than anything built yet.
  const isLastImplementedStep = stepIndex === steps.length - 1;

  const updateValues = useCallback((patch: Partial<TValues>) => {
    setValues((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleValidityChange = useCallback((valid: boolean) => {
    setIsCurrentStepValid(valid);
  }, []);

  const goBack = () => {
    if (isFirstStep) return;
    setIsCurrentStepValid(false);
    setStepIndex((i) => i - 1);
  };

  // `force` is what "Skip this step" uses (see currentStep.skippable
  // below) - it advances regardless of isCurrentStepValid, since a
  // skippable step is one where "incomplete" was never really a
  // meaningful state to begin with. It still respects
  // isLastImplementedStep: skipping can't invent a step that isn't built.
  const goNext = (force = false) => {
    if ((!isCurrentStepValid && !force) || isLastImplementedStep) return;
    setIsCurrentStepValid(false);
    setStepIndex((i) => i + 1);
  };

  const canGoNext = isCurrentStepValid && !isLastImplementedStep;
  const canSkip = Boolean(currentStep.skippable) && !isLastImplementedStep;

  // Explicit jump to any step by id - see StepProps.goToStep's own
  // comment. `steps` is stable (each flow defines it as a module-level
  // constant, not recreated per render), so this only ever recomputes if
  // a future caller genuinely passes a different steps array.
  const goToStep = useCallback(
    (stepId: string) => {
      const index = steps.findIndex((s) => s.id === stepId);
      if (index === -1) return;
      setIsCurrentStepValid(false);
      setStepIndex(index);
    },
    [steps],
  );

  // Fires just before the Exit link navigates away. Serializes with a
  // replacer that drops File instances (e.g. Step 3's idDocument) rather
  // than throwing - File objects were never JSON-safe or restorable from
  // localStorage anyway, so an applicant who saved after uploading an ID
  // will need to re-upload it on return; every other field round-trips.
  const handleExit = () => {
    if (!storageKey) return;
    try {
      const serializable = JSON.stringify({ stepIndex, values }, (_key, value) =>
        value instanceof File ? undefined : value,
      );
      localStorage.setItem(storageKey, serializable);
    } catch {
      // Storage full/unavailable - exiting should never be blocked by a
      // best-effort save failing.
    }
  };

  // See StepProps.clearSavedProgress's own comment - called by a step once
  // its data stops being a draft worth resuming (e.g. a successful final
  // submission), so a later visit doesn't restore the now-submitted draft.
  const clearSavedProgress = useCallback(() => {
    if (!storageKey) return;
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Nothing to do if storage is unavailable - there's nothing to clear.
    }
  }, [storageKey]);

  const stepProps = {
    values,
    updateValues,
    onValidityChange: handleValidityChange,
    goToStep,
    clearSavedProgress,
    saveAndExit: handleExit,
  };

  // A fullScreen step (see StepDefinition's own comment - currently just
  // the Investor Application's Confirmation step) owns the entire screen;
  // none of this shell's own header/progress/card/nav chrome applies to
  // it, so it's rendered on its own rather than nested inside any of that.
  if (currentStep.fullScreen) {
    return currentStep.render(stepProps);
  }

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex w-full max-w-xl flex-col gap-8">
        {/* Minimal header - no site Navbar here on purpose. This is a
            focused application flow, not a marketing page, and the brief
            calls for keeping friction low; a full nav (with its own CTA
            and links away from the flow) works against that. Just the
            logo and a plain way back out. */}
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="AUREX home">
            <BrandMark variant="nav" />
          </Link>
          {/* Suppressed for a step that renders this same action itself,
              positioned wherever makes more sense there (e.g. Review &
              Submit, beside its Submit button) - see
              StepDefinition.hideExitLink's own comment. */}
          {!currentStep.hideExitLink && (
            <Link
              href="/"
              onClick={handleExit}
              className="font-sans text-sm text-cream-dim transition-colors hover:text-gold-light"
            >
              Save &amp; Exit
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {eyebrow && (
            <p className="font-jakarta text-xs font-medium uppercase tracking-[1.8px] text-gold-muted">
              {eyebrow}
            </p>
          )}
          <div className="flex items-center justify-between gap-4">
            <span className="font-sans text-sm font-medium text-cream-dim">
              Step {stepIndex + 1} of {totalSteps}
            </span>
            <span className="font-sans text-sm font-medium text-cream-dim">{currentStep.label}</span>
          </div>
          <div className="flex items-center gap-1.5" role="progressbar" aria-valuenow={stepIndex + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  i <= stepIndex ? "bg-gold" : "bg-grid-line"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="border border-gold/20 bg-panel/40 p-6 backdrop-blur-2xl sm:p-8">
          {/* mode="wait" + key={currentStep.id}: each step fully unmounts
              before the next mounts, so a step's own internal state
              (touched fields, etc.) never bleeds into a different step
              that happens to reuse the same field names. */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: easing.smooth }}
            >
              {currentStep.render(stepProps)}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-4 border-t border-grid-line pt-6">
            <motion.button
              {...(isFirstStep ? {} : hoverScale)}
              type="button"
              onClick={goBack}
              disabled={isFirstStep}
              className="font-jakarta text-sm font-medium text-cream-dim transition-colors hover:text-cream disabled:cursor-not-allowed disabled:opacity-30"
            >
              Back
            </motion.button>
            {!currentStep.hideContinueButton && (
              <div className="flex items-center gap-4 sm:gap-6">
                {canSkip && (
                  <button
                    type="button"
                    onClick={() => goNext(true)}
                    className="font-jakarta text-sm font-medium text-cream-dim underline-offset-4 transition-colors hover:text-cream hover:underline"
                  >
                    Skip this step
                  </button>
                )}
                <motion.button
                  {...(canGoNext ? hoverScale : {})}
                  type="button"
                  onClick={() => goNext()}
                  disabled={!canGoNext}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3 font-jakarta text-sm font-medium text-amainblack transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
