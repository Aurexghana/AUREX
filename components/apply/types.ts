import type { ReactNode } from "react";

/**
 * Shared contract between MultiStepFormShell and every step it renders.
 * The shell owns `values` (so data survives moving back/forward across
 * steps) and only ever hands a step its own updater + validity reporter -
 * a step never needs to know about the shell's navigation, and the shell
 * never needs to know a given step's field-level validation rules.
 */
export type StepProps<TValues> = {
  values: TValues;
  updateValues: (patch: Partial<TValues>) => void;
  /**
   * A step calls this (typically from a useEffect over its own fields)
   * whenever whether-it's-complete changes. The shell uses the latest
   * value to enable/disable "Continue" - it never validates a step's
   * fields itself.
   */
  onValidityChange: (isValid: boolean) => void;
  /**
   * Jumps directly to another step by its `id` (see StepDefinition below),
   * bypassing the usual sequential Back/Continue flow - e.g. a Review &
   * Submit step's per-section "Edit" links, or a submit handler advancing
   * straight to a Confirmation step on success. Unlike goNext, this never
   * checks the current step's validity; it's an explicit jump, not a
   * "progress forward" action.
   */
  goToStep: (stepId: string) => void;
  /**
   * Clears whatever "Save & Exit" progress is stored for this flow (a
   * no-op if `storageKey` wasn't given to the shell). A step calls this
   * once its data is no longer a draft worth resuming - e.g. right after
   * a successful final submission - so a later visit to this flow starts
   * genuinely fresh instead of silently resurrecting the now-submitted
   * draft.
   */
  clearSavedProgress: () => void;
  /**
   * Persists "Save & Exit" progress right now (a no-op if `storageKey`
   * wasn't given to the shell) without itself navigating anywhere - a step
   * that renders its own "Save & Exit" action (e.g. Review & Submit,
   * beside its Submit button; see StepDefinition.hideExitLink) pairs this
   * with its own `<Link href="/">`'s onClick, same as the shell's header
   * link already does for every other step.
   */
  saveAndExit: () => void;
};

export type StepDefinition<TValues> = {
  /** Stable id, used as the React key when switching steps (so a step's
   *  own internal state/effects reliably reset on entry rather than
   *  bleeding over from whatever the previous step left behind), and as
   *  the target for a step's own goToStep calls. */
  id: string;
  /** Shown in the shell's progress row (e.g. "Identity & Contact"). */
  label: string;
  /**
   * When true, the shell renders a secondary "Skip this step" action next
   * to Continue that advances regardless of validity - for a step where
   * every field is optional (e.g. the Investor Application's "Optional
   * Details" step), so skipping is its own visible, honest action rather
   * than relying on Continue being enabled without saying why.
   */
  skippable?: boolean;
  /**
   * When true, the shell doesn't render its own shared Continue button for
   * this step (Back is unaffected) - for a step whose primary action isn't
   * a simple "am I valid, then advance" (e.g. Review & Submit, which
   * submits asynchronously and only advances on success). Without this,
   * such a step would sit next to a permanently-disabled decoy Continue
   * button alongside its own real action.
   */
  hideContinueButton?: boolean;
  /**
   * When true, the shell's own header doesn't render its "Save & Exit"
   * link for this step - for a step that renders that same action itself,
   * positioned wherever makes sense for that step (e.g. Review & Submit,
   * beside its Submit button) rather than leaving a second, disconnected
   * copy of it up in the header.
   */
  hideExitLink?: boolean;
  /**
   * When true, the shell renders exactly this step's own output and
   * nothing else - no logo/Save & Exit header, no progress bar, no
   * Back/Continue row, no card chrome. For a terminal screen (e.g. the
   * Investor Application's Confirmation step) that needs to feel like a
   * conclusion rather than "another step in the form", and that also
   * needs to work as a fully standalone page reachable outside this flow
   * entirely - the shell's own chrome would be actively wrong there, not
   * just unnecessary.
   */
  fullScreen?: boolean;
  render: (props: StepProps<TValues>) => ReactNode;
};
