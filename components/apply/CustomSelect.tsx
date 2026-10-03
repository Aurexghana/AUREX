"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { fieldClassName } from "@/components/apply/FormField";
import type { SelectOption } from "@/lib/optionalDetails";

/**
 * Custom listbox replacing every native <select> in the app (apply flow,
 * dashboard Report tab). A native <select>'s own open popup is rendered by
 * the OS/browser, not by our CSS - the only thing we could ever reach was
 * each <option>'s background/text color (see the old `optionStyle`), never
 * the hover/highlight color (a system blue on most platforms) or the row
 * layout itself. This renders the whole popup ourselves instead, so both
 * are fully ours: gold hover to match the rest of the site's interactive
 * states, and square corners (no rounded-* anywhere here) to match AUREX's
 * own sharp-edged chrome rather than the soft rounded-md list a generic
 * dropdown pattern would otherwise use.
 *
 * The trigger reuses fieldClassName - the exact same border/bg/padding
 * every text input and the old <select> already shared - so swapping this
 * in doesn't change a form's rhythm, just what opens when you click it.
 *
 * Keyboard behavior mirrors a native <select> closely enough that this
 * isn't a functional downgrade: Up/Down/Home/End moves the highlighted
 * option, Enter/Space commits it, Escape closes, and typing jumps to the
 * first option starting with what's been typed (important for the ~200-
 * entry country lists, where scrolling to find "Ghana" by hand isn't
 * reasonable). Only real gap vs. native: no `required`/native constraint
 * validation, since this was never a real form control to begin with -
 * every call site already does its own manual required-field check
 * (`touched`/`error` state), so nothing actually relied on that.
 */
export default function CustomSelect({
  id,
  value,
  onChange,
  options,
  placeholder = "Select…",
  hasError = false,
  disabled = false,
  onBlur,
  ariaLabel,
  triggerClassName = "",
  wrapperClassName = "",
  size = "default",
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  hasError?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
  /** Only needed when this isn't paired with a FormField <label htmlFor> -
   *  e.g. the inline phone-country-code picker beside the phone input. */
  ariaLabel?: string;
  /** Sizing/width overrides for the trigger - the same string every call
   *  site used to pass as fieldClassName's own `extra` param. */
  triggerClassName?: string;
  /** e.g. "shrink-0" for the phone-country-code picker sitting beside the
   *  phone number input in a flex row. */
  wrapperClassName?: string;
  /** "compact" is the narrow phone-country-code chevron (smaller icon,
   *  tighter right inset) - every other select uses the default sizing. */
  size?: "default" | "compact";
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeaheadRef = useRef("");
  const typeaheadTimerRef = useRef<number | undefined>(undefined);
  const listboxId = useId();

  const selectedOption = options.find((o) => o.value === value);
  const isPlaceholder = !selectedOption && !value;
  // `||`, not `??`: `value` starts as `""` on every unselected field (not
  // null/undefined), which `??` treats as already "present" and returns
  // as-is - rendering the trigger's label span truly empty instead of
  // falling through to `placeholder`. An empty span collapses to ~0 height
  // in a flex row (no text to establish a line box), which is exactly the
  // "field is short until something's selected" bug this was causing on
  // every CustomSelect in the app. `||` treats "" as falsy and falls
  // through correctly, while still preserving the original fallback intent
  // below for when `value` is a real, non-empty, not-yet-matched value -
  // e.g. phoneCountry during the brief window before IdentityContactStep's
  // effect populates the real option list - showing something sensible
  // instead of going blank.
  const displayLabel = selectedOption?.label || value || placeholder;

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  // Highlighting the current value is something that only ever needs to
  // happen at the moment the panel opens (every place that can open it -
  // click, or Up/Down/Enter/Space while closed - calls this instead of
  // setOpen(true) directly), not something to keep in sync with `open` via
  // an effect: an effect reacting to `open` would fire on every render
  // where it's already true, fighting the arrow-key navigation below.
  const openMenu = () => {
    const startIndex = options.findIndex((o) => o.value === value);
    setHighlighted(startIndex >= 0 ? startIndex : 0);
    setOpen(true);
  };

  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.children[highlighted] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [highlighted, open]);

  const commit = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (!open) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openMenu();
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlighted((h) => Math.min(h + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlighted((h) => Math.max(h - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setHighlighted(0);
        break;
      case "End":
        event.preventDefault();
        setHighlighted(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(highlighted);
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        if (event.key.length === 1) {
          window.clearTimeout(typeaheadTimerRef.current);
          typeaheadRef.current += event.key.toLowerCase();
          const query = typeaheadRef.current;
          const match = options.findIndex((o) => o.label.toLowerCase().startsWith(query));
          if (match >= 0) setHighlighted(match);
          typeaheadTimerRef.current = window.setTimeout(() => {
            typeaheadRef.current = "";
          }, 500);
        }
    }
  };

  const chevronClassName =
    size === "compact"
      ? "pointer-events-none absolute right-2.5 top-1/2 size-2.5 -translate-y-1/2 text-gold-bright transition-transform"
      : "pointer-events-none absolute right-4 top-1/2 size-3 -translate-y-1/2 text-gold-bright transition-transform";

  return (
    <div ref={wrapperRef} className={`relative ${wrapperClassName}`.trim()}>
      <button
        type="button"
        id={id}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleTriggerKeyDown}
        onBlur={() => onBlur?.()}
        className={fieldClassName(hasError, `text-left disabled:cursor-not-allowed disabled:opacity-60 ${triggerClassName}`)}
      >
        {/* min-w-0 is required for truncate to work at all inside a flex
            row (fieldClassName's own `flex items-center`) - a flex item's
            default min-width is `auto`, which lets it grow past its
            container instead of ever triggering the ellipsis. */}
        <span className={`block min-w-0 flex-1 truncate ${isPlaceholder ? "text-cream-dim/60" : ""}`}>
          {displayLabel}
        </span>
      </button>
      <ChevronDownIcon className={`${chevronClassName} ${open ? "rotate-180" : ""}`} />

      {open && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          className="no-scrollbar absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-auto border border-grid-line bg-ink shadow-lg light:bg-white"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => commit(index)}
                // "Selected" (gold text, persists regardless of hover) and
                // "highlighted" (gold background - keyboard position, or
                // whatever the mouse is over) are deliberately separate: the
                // instant this panel opens, Chromium re-runs hit-testing
                // under a stationary cursor and can hand it a fresh
                // onMouseEnter with no actual pointer movement, immediately
                // reassigning `highlighted` away from the option that was
                // just scrolled into view as the current selection. Without
                // its own always-on indicator, that reassignment would make
                // the real selection look unmarked the moment the panel
                // opens, purely because of where the cursor happened to
                // rest - same fix either way (a stray hover, or the user
                // deliberately hovering elsewhere): show the true selection
                // regardless of what's currently highlighted.
                className={`cursor-pointer px-4 py-2.5 font-sans text-sm transition-colors ${
                  index === highlighted ? "bg-gold/15" : ""
                } ${isSelected ? "font-medium text-gold-bright" : "text-cream"}`}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
