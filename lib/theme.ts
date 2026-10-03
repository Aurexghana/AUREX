"use client";

import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "aurex-theme";

/**
 * Inline script injected into <head> (see app/layout.tsx) so the stored
 * theme preference is applied to <html data-theme> before the very first
 * paint - avoids a flash of the wrong theme on load. This intentionally
 * creates a real attribute mismatch on <html> between what the server
 * rendered and what the client shows before hydration, which is exactly
 * what <html suppressHydrationWarning> in the root layout is there to
 * allow - see the comment there.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"){document.documentElement.setAttribute("data-theme","light");}}catch(e){}})();`;

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

// Always "dark" for the server (and for the client's very first render,
// before it can subscribe) - matching what the server-rendered markup
// looks like, since the server has no access to localStorage. The head
// script above corrects the real DOM attribute before paint; this hook
// then picks that up on the client's first subscription tick.
function getServerSnapshot(): Theme {
  return "dark";
}

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

/**
 * Reads/writes the current theme. Backed by useSyncExternalStore rather
 * than useState+useEffect: the theme genuinely lives outside React (a
 * DOM attribute, mutated by a plain <script> and by this hook's own
 * setTheme), so this is the primitive React provides specifically for
 * subscribing to that kind of external, mutable source - every component
 * calling this hook (the navbar's toggle button, BrandMark's logo swap)
 * stays in sync via the shared MutationObserver subscription, no context
 * provider needed for something this small.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = (next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage can throw in private-browsing/blocked-storage contexts;
      // the theme still applies for this page load, it just won't persist.
    }
    // No manual re-render needed - the MutationObserver subscription above
    // picks up this attribute change and notifies every subscriber itself.
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return { theme, setTheme, toggleTheme };
}
