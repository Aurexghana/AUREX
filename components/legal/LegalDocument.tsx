"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import BrandMark from "@/components/BrandMark";
import { ChevronDownIcon } from "@/components/icons";

/**
 * Shared shell + typography primitives for the site's standalone legal
 * pages (/terms, /privacy) - extracted from the original /terms page once
 * /privacy needed the exact same document styling, per the brief's own
 * "same document styling as /terms" requirement. Both pages still own
 * their actual section content; this file only owns the repeated layout
 * (logo + back link, title block, cross-link footer) and the plain
 * heading/paragraph/list/accordion building blocks each page's sections
 * use.
 */

export function Heading({ children }: { children: string }) {
  return <h2 className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">{children}</h2>;
}

export function Paragraph({ children }: { children: ReactNode }) {
  return <p className="font-sans text-sm leading-7 text-cream-dim sm:text-base sm:leading-8">{children}</p>;
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5 font-sans text-sm leading-7 text-cream-dim sm:text-base sm:leading-8">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * One collapsible section of a legal document - per request, both /terms
 * and /privacy pack a lot onto one screen (9-11 sections each, stacked
 * full-height), so collapsing each section behind its own heading cuts
 * the page down to a scannable list of headings instead of a wall of
 * text. Same accordion mechanics as the home page's own FAQ section
 * (components/Faq.tsx) - single-item open/close, AnimatePresence height
 * animation, rotating ChevronDownIcon - reused here rather than a new
 * pattern, but each section keeps its OWN independent open state (an
 * array/index-based "only one open" model like FAQ's doesn't fit a
 * document someone might genuinely want several sections open in at
 * once, e.g. comparing "How We Share Your Information" against "Your
 * Rights" side by side while scrolling).
 *
 * The heading stays a real `<h2>` (wrapping the toggle button, not
 * replaced by it) purely for accessibility - a screen reader's heading
 * navigation should still find "3. Investor Applications and Membership"
 * as a heading even though it's also interactive.
 */
export function AccordionSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-grid-line pb-2">
      <h2>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 py-4 text-left"
        >
          <span className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">{title}</span>
          <ChevronDownIcon
            className={`size-3 shrink-0 text-gold-bright transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </h2>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * The page-level shell both /terms and /privacy render their sections
 * inside. Deliberately skips the site's usual Navbar/PageBanner/Footer
 * chrome - per the brief, these should read like plain legal documents,
 * not marketing pages. Just the logo, a way back to the home page, and
 * the document itself, capped to a comfortable reading width (max-w-3xl)
 * rather than stretching full-width on large screens.
 *
 * `crossLink` renders a small "See also our ___" line at the bottom of
 * the document, pointing at the other legal page - these two documents
 * reference each other in practice, so each should be one click from the
 * other rather than requiring a trip back through the footer.
 */
export function LegalPageShell({
  title,
  lastUpdated,
  crossLink,
  children,
}: {
  title: string;
  lastUpdated: string;
  crossLink: { label: string; href: string };
  children: ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex w-full max-w-3xl flex-col gap-10">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="AUREX home">
            <BrandMark variant="nav" />
          </Link>
          <Link href="/" className="font-sans text-sm text-cream-dim transition-colors hover:text-gold-light">
            ← Back to Home
          </Link>
        </div>

        <article className="flex flex-col gap-10">
          <div className="flex flex-col gap-2 border-b border-grid-line pb-8">
            <h1 className="font-jakarta text-3xl font-semibold text-cream sm:text-4xl">{title}</h1>
            <p className="font-sans text-sm text-cream-dim">Last updated: {lastUpdated}</p>
            <p className="mt-2 font-sans text-xs italic text-cream-dim/70">
              This is placeholder content standing in for AUREX&apos;s actual {title}, pending final legal review. Do
              not treat it as binding.
            </p>
          </div>

          {/* No gap here (unlike the gap-10 macro-spacing between this
              block, the title, and the footer below) - each child is now
              an AccordionSection, which supplies its own rhythm via its
              own border-b/padding, same as the FAQ section's own list.
              A gap-10 on top of that would leave an oversized, loose-
              looking space between every collapsed heading. */}
          <div className="flex flex-col">{children}</div>

          <div className="flex flex-col gap-2 border-t border-grid-line pt-8">
            <p className="font-sans text-sm text-cream-dim">
              See also our{" "}
              <Link
                href={crossLink.href}
                className="text-gold-bright underline-offset-4 transition-colors hover:text-gold-light hover:underline"
              >
                {crossLink.label}
              </Link>
              .
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
