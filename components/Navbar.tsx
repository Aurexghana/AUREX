"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, slideInRight, hoverScale } from "@/lib/motion";
import BrandMark from "@/components/BrandMark";
import JoinAurexModal from "@/components/JoinAurexModal";

// Per Figma node 37:1946 (updated): "About Us" has been replaced with
// "How it Works". This used to be an in-page anchor down to the summary
// section on the home page (components/HowItWorks.tsx); now that the fuller
// standalone /how-it-works page exists (components/PageBanner.tsx +
// HowItWorksProcess.tsx), the nav link points there instead. Contact
// likewise now has its own standalone page (components/ContactSection.tsx)
// instead of routing to the coming-soon placeholder. "Insights" has been
// removed per request. The public /leaderboard page and its nav link are
// gone too - the leaderboard is only available inside the dashboards now.
const NAV_LINKS = [
  { label: "How it Works", href: "/how-it-works" },
  { label: "Contact", href: "/contact" },
];

// The "active" gold-underline treatment used to be hardcoded onto Home
// regardless of which page was actually open - now driven by the real
// route (usePathname) so it follows whichever page you're on instead.
// border-b-2/pb-1.5 is applied to BOTH states (border-transparent when
// inactive) so every desktop link reserves the same underline space and
// stays vertically aligned whether or not it's the active one.
function desktopLinkClassName(isActive: boolean) {
  return isActive
    ? "border-b-2 border-gold bg-gradient-to-r from-gold via-gold-light via-50% to-gold bg-clip-text pb-1.5 font-jakarta text-[16px] font-semibold tracking-[0.7px] text-transparent"
    : "border-b-2 border-transparent pb-1.5 font-sans text-[16px] font-medium tracking-[0.7px] text-neutral-200 transition-colors hover:text-cream light:text-[#1a1a1a] light:hover:text-gold-deep";
}

// Large running-list typography for the slide-in panel's primary links -
// per the reference mobile design, a numbered, comma-joined flow ("01Home,
// 02How it Works,") that wraps naturally, rather than one link per line.
function mobileLinkClassName(isActive: boolean) {
  return isActive
    ? "font-jakarta text-2xl font-semibold tracking-tight text-gold-light sm:text-3xl"
    : "font-jakarta text-2xl font-semibold tracking-tight text-cream transition-colors hover:text-gold-light light:text-[#1a1a1a] light:hover:text-gold-deep sm:text-3xl";
}

// The panel's own secondary link columns - same footer-only content the
// reference design's "Download/Work with us/Business" + "Instagram/
// Facebook/LinkedIn" pattern surfaces (real links a mobile visitor
// otherwise has to scroll all the way to the footer for), not anything
// already shown on the main navbar. Login is the one exception - it's a
// primary nav-level link, but the header only shows it from sm: up (see
// its `hidden sm:inline-block` above), so on true mobile this panel is
// still the only place it appears.
const SECONDARY_LINKS = [
  { label: "Login", href: "/login" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms and Conditions", href: "/terms" },
];

// Same three platforms/placeholder hrefs as Footer.tsx's own SOCIAL_ICONS
// - plain text here instead of icon buttons, matching the reference
// design's own plain-text social column.
const SOCIAL_LINKS = ["Facebook", "Twitter", "LinkedIn"];

// Replaces the old 3-line hamburger - per request, a 2x2 dot grid (a more
// modern "more options" affordance, matching the reference mobile design)
// that morphs into a close (X) glyph once the panel is open, same swap
// pattern the old MenuIcon used.
function MenuTriggerIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
        <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
      <circle cx="5.5" cy="5.5" r="1.7" fill="currentColor" />
      <circle cx="14.5" cy="5.5" r="1.7" fill="currentColor" />
      <circle cx="5.5" cy="14.5" r="1.7" fill="currentColor" />
      <circle cx="14.5" cy="14.5" r="1.7" fill="currentColor" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const pathname = usePathname();

  // Closes the panel on Escape - the only "click outside to close" affordance
  // needed now is the backdrop's own onClick below (it covers the entire
  // rest of the screen while the panel is open), but that leaves no
  // keyboard-only way to dismiss it without this.
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Locks background scroll while the panel is open - without this, the
  // page underneath keeps scrolling on any touch/wheel input that lands on
  // the backdrop, which is exactly the "not properly implemented" mobile
  // nav gap this fixes: a real slide-in panel is expected to behave like a
  // modal, not a layer floating over a page that's still interactive
  // underneath it. `overflow: hidden` on the body alone doesn't reliably
  // stop touch-scrolling in mobile Safari (a long-documented iOS quirk) -
  // pinning the body with `position: fixed` at its negated current scroll
  // offset is the standard, actually-robust fix, so this restores that
  // exact scroll position on close (via `window.scrollTo`) rather than
  // snapping back to the top.
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const { position, top, width, overflow } = document.body.style;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.position = position;
      document.body.style.top = top;
      document.body.style.width = width;
      document.body.style.overflow = overflow;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  return (
    // JoinAurexModal (and, on mobile, the nav panel + its backdrop) are
    // rendered as siblings of <motion.header> below, NOT nested inside it:
    // the header has `backdrop-blur-md`, and a `backdrop-filter` on an
    // ancestor - like `transform`/`filter`/`perspective` - establishes a
    // new containing block for any `position: fixed` descendant (see MDN's
    // "Identifying the containing block" page). Nesting a `fixed inset-0`
    // element inside the header made it resolve against the header's own
    // navbar-height-only box instead of the viewport.
    <>
      <motion.header
        variants={fadeIn}
        initial="initial"
        animate="animate"
        // Docked flush to the top edge and spanning the full viewport width
        // - no floating pill, no side margin, no border-radius. Per
        // request: "remove the round[ed] [pil]l on the navbar and make it
        // touch the edges."
        className="fixed inset-x-0 top-0 z-50 w-full border-b border-grid-line bg-ink/80 backdrop-blur-md"
      >
        {/* Inner row is capped to the same max-w-[1280px] content column every
            page body uses (see page.tsx etc.) and centered within the full-
            bleed bar above - otherwise on very wide/ultrawide desktop
            viewports (the bar itself has no max-width, by design, so its
            bg/border still spans edge-to-edge) the logo and nav/CTA group
            would drift apart to the far left/right edges of the screen while
            the actual page content below stays centered in its 1280px
            column, visibly misaligning the nav from everything under it. */}
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-6 lg:gap-12">
            {/* Stays visible at every breakpoint, per request - only Join
                Aurex moved into the mobile nav panel below, not the logo. */}
            <Link href="/" aria-label="AUREX home" className="shrink-0">
              <BrandMark variant="nav" />
            </Link>

            <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
              <Link href="/" className={desktopLinkClassName(pathname === "/")}>
                Home
              </Link>
              {NAV_LINKS.map(({ label, href }) => (
                <a key={label} href={href} className={desktopLinkClassName(pathname === href)}>
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/login"
              className="hidden px-2 py-2 font-sans text-[16px] font-medium tracking-[0.7px] text-neutral-200 transition-colors hover:text-cream light:text-[#1a1a1a] light:hover:text-gold-deep sm:inline-block"
            >
              Login
            </Link>
            {/* Opens JoinAurexModal instead of linking straight to
                /coming-soon - this single CTA used to go to one generic
                placeholder, but the site actually serves two distinct
                audiences (investors, and businesses raising capital), so it
                now offers a choice between the two first.

                hidden below lg, same as the logo above - moved into the
                mobile nav panel instead (per request), rather than living
                in both places. The mobile-vs-sm+ pill-size split this used
                to need (it shared the row with the logo/hamburger) is gone
                too, now that it only ever renders at its lg+ size. */}
            <motion.button
              {...hoverScale}
              type="button"
              onClick={() => setJoinModalOpen(true)}
              className="hidden items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-4 py-3 font-jakarta text-[16px] text-amainblack lg:flex"
            >
              Join Aurex
            </motion.button>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex size-9 items-center justify-center text-cream lg:hidden"
            >
              <MenuTriggerIcon open={open} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile nav: a side panel sliding in from the right over a dimmed
          backdrop, below the header rather than overlapping it (top-[73px]/
          top-[85px] match the header's own real height at each of its two
          breakpoint sizes - see BrandMark's "nav" variant) - so the header
          itself stays fully visible and its own toggle button keeps working
          as the close control (no separate close button needed in here).

          The logo stays on the header at every breakpoint (per request),
          so it does NOT repeat here. Join Aurex is still hidden on the
          header below lg (see its own comment up there) and lives here
          instead. Primary nav is a running numbered list ("01Home, 02How
          it Works,"), and below it a secondary block of footer-only
          content (Login - the header only shows it from sm: up - plus
          Privacy/Terms and the social list, which a mobile visitor would
          otherwise have to scroll all the way to the footer for). */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="mobile-nav-backdrop"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="initial"
              onClick={() => setOpen(false)}
              aria-hidden="true"
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <motion.nav
              key="mobile-nav-panel"
              id="mobile-nav"
              aria-label="Primary"
              variants={slideInRight}
              initial="initial"
              animate="animate"
              exit="exit"
              // inset-x-0 (both left:0 and right:0) is mobile-only sizing -
              // from sm: it has to give way to sm:right-0/sm:left-auto,
              // otherwise the explicit sm:w-[...] and the still-active
              // left:0/right:0 fight over the box's width, and the
              // left:0 + width combination wins (over-constrained per the
              // CSS box model - the browser drops `right` and solves from
              // left+width), docking the panel to the LEFT edge instead of
              // sliding in from the right.
              //
              // bg-ink/75 backdrop-blur-xl - glass effect per request,
              // same recipe the header itself already uses (bg-ink/80
              // backdrop-blur-md) just a touch more translucent/blurred:
              // this panel is a much bigger surface sitting directly over
              // page content (the header only ever floats over a small
              // strip at the very top), so it leans a little further
              // toward "glass" for the same reason. The dimmed backdrop
              // behind it (bg-black/60 above) still supplies the contrast
              // that keeps the panel's own text readable against whatever
              // scrolled-to content is showing through.
              className="fixed inset-x-0 bottom-0 top-[73px] z-40 flex w-full flex-col overflow-y-auto border-t border-grid-line bg-ink/75 px-6 py-8 backdrop-blur-xl sm:left-auto sm:right-0 sm:top-[85px] sm:w-[min(70vw,380px)] sm:border-l sm:border-t-0 lg:hidden"
            >
              {/* Open space above the link list, matching the reference -
                  everything below sits as one cluster in the lower portion
                  of the panel rather than starting flush under the top
                  edge. flex-1 rather than a fixed margin so it gracefully
                  shrinks to nothing on a short viewport instead of pushing
                  content into overflow. */}
              <div aria-hidden="true" className="flex-1" />

              <div className="flex flex-wrap items-baseline gap-x-1 gap-y-2">
                {[{ label: "Home", href: "/" }, ...NAV_LINKS].map(({ label, href }, i) => (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="inline-flex items-baseline"
                  >
                    <span className="relative -top-2 mr-0.5 font-jakarta text-[10px] font-medium text-cream-dim sm:text-xs">
                      0{i + 1}
                    </span>
                    <span className={mobileLinkClassName(pathname === href)}>
                      {label}
                      {i < NAV_LINKS.length ? "," : "."}
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-10 grid grid-cols-2 gap-6 border-t border-grid-line pt-8">
                <div className="flex flex-col gap-3">
                  {SECONDARY_LINKS.map(({ label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setOpen(false)}
                      className="font-sans text-sm text-cream-dim transition-colors hover:text-cream light:text-[#5f5e5e] light:hover:text-gold-deep"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  {SOCIAL_LINKS.map((label) => (
                    <a
                      key={label}
                      href="#"
                      onClick={() => setOpen(false)}
                      className="font-sans text-sm text-cream-dim transition-colors hover:text-cream light:text-[#5f5e5e] light:hover:text-gold-deep"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              <motion.button
                {...hoverScale}
                type="button"
                onClick={() => {
                  setOpen(false);
                  setJoinModalOpen(true);
                }}
                className="mt-8 flex shrink-0 items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-4 py-3 font-jakarta text-[16px] text-amainblack"
              >
                Join Aurex
              </motion.button>

              <p className="mt-8 font-sans text-xs text-cream-dim/60">© 2026 Aurex Investment. All rights reserved.</p>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <JoinAurexModal isOpen={joinModalOpen} onClose={() => setJoinModalOpen(false)} />
    </>
  );
}
