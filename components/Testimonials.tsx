"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, staggerItem, hoverLift } from "@/lib/motion";
import SectionBackgroundVector from "@/components/SectionBackgroundVector";
import { getTestimonials, type Testimonial } from "@/lib/testimonials";

// Continuous marquee speed, not a discrete "advance every N seconds" -
// per request, this should always be gently scrolling on its own at
// every breakpoint (not just a mobile slideshow), while still letting
// the user take over with a manual drag/swipe/wheel scroll at any time.
const AUTO_SCROLL_PX_PER_SEC = 40;
const RESUME_AFTER_INTERACTION_MS = 2500;

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    getTestimonials().then((data) => {
      if (!cancelled) setTestimonials(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Rendered twice back-to-back so the marquee can loop seamlessly: once
  // scrollLeft passes the first copy's width we snap back by exactly that
  // width, which - because the second copy is identical - is visually
  // indistinguishable from the scroll continuing.
  const displayTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    if (prefersReducedMotion) return;

    const step = (ts: number) => {
      const el = scrollerRef.current;
      if (el) {
        if (lastTsRef.current === null) lastTsRef.current = ts;
        const dt = ts - lastTsRef.current;
        lastTsRef.current = ts;

        if (!pausedRef.current) {
          const loopWidth = el.scrollWidth / 2;
          if (loopWidth > 0) {
            let next = el.scrollLeft + (AUTO_SCROLL_PX_PER_SEC * dt) / 1000;
            if (next >= loopWidth) next -= loopWidth;
            el.scrollLeft = next;
          }
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [prefersReducedMotion]);

  // Pause while the user is actually hovering, dragging, or wheeling the
  // carousel, then pick the marquee back up shortly after they stop - so
  // it never fights a manual scroll, but still keeps drifting on its own
  // the rest of the time.
  const handleInteractionStart = () => {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };

  const handleInteractionEnd = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      // Reset the timestamp baseline so the next frame's dt is measured
      // from "now", not from however long ago the marquee was paused -
      // otherwise it would jump forward to catch up.
      lastTsRef.current = null;
      pausedRef.current = false;
    }, RESUME_AFTER_INTERACTION_MS);
  };

  if (testimonials.length === 0) return null;

  return (
    <section
      id="insights"
      className="relative w-full overflow-hidden border border-grid-line px-6 py-16 sm:px-10 sm:py-20 md:px-16 md:py-24 lg:px-[100px]"
    >
      <SectionBackgroundVector variant="testimonials" />
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col items-center gap-12 sm:gap-16"
      >
        <motion.h2
          variants={staggerItem}
          className="text-center font-jakarta text-2xl font-semibold tracking-tight text-cream sm:text-3xl lg:text-4xl"
        >
          Client Perspectives
        </motion.h2>

        {/* No fixed aspect-ratio on the cards below, on purpose: Figma's
            card hit its ~339x258 landscape proportions because its quote
            text was manually pre-broken into exactly 3 lines. A real
            browser wraps this text differently at different widths, so
            locking the box to that ratio clipped text out of view
            (invisible, since the card also had overflow-hidden). Letting
            height follow content avoids that.

            The quote mark is absolutely positioned (matching the Figma
            source, which floats it in the corner rather than stacking it
            in the flex flow) so it doesn't consume its own line above the
            text - that was the main source of the extra height. */}
        {/* A horizontal marquee at every breakpoint - always drifting on
            its own (via the rAF loop above), pausing the instant the user
            hovers, drags, touches, or wheels it, and picking back up a
            couple seconds after they let go. Scrollbar hidden via
            .no-scrollbar since this reads as a ticker, not a visibly-
            scrollable list, even though the underlying overflow-x-auto is
            genuinely native-scrollable - a mouse drag, trackpad swipe, or
            shift+wheel moves it just like any other scroll container. The
            testimonial list is rendered twice back-to-back (see
            DISPLAY_TESTIMONIALS) so the loop-reset in the rAF step is
            invisible. Zero horizontal padding on this strip, on purpose -
            the first/last card should touch this div's true edges rather
            than sit behind an inset gutter. The negative margin/width pair
            below bleeds this div out past the section's own horizontal
            padding at every breakpoint (mirroring the section's own px-6
            sm:px-10 md:px-16 lg:px-[100px] scale exactly), so those edges
            land on the section's actual border, not just the section's
            padded content column. */}
        <div
          ref={scrollerRef}
          onPointerEnter={handleInteractionStart}
          onPointerLeave={handleInteractionEnd}
          onPointerDown={handleInteractionStart}
          onPointerUp={handleInteractionEnd}
          onPointerCancel={handleInteractionEnd}
          onWheel={() => {
            handleInteractionStart();
            handleInteractionEnd();
          }}
          className="no-scrollbar -mx-6 flex w-[calc(100%+3rem)] gap-6 overflow-x-auto pb-2 sm:-mx-10 sm:w-[calc(100%+5rem)] sm:pb-0 md:-mx-16 md:w-[calc(100%+8rem)] lg:-mx-[100px] lg:w-[calc(100%+200px)]"
        >
          {displayTestimonials.map((t, i) => (
            <motion.div
              key={`${t.initials}-${i}`}
              variants={staggerItem}
              {...hoverLift}
              aria-hidden={i >= testimonials.length}
              className="relative flex w-[85%] shrink-0 flex-col items-start justify-between gap-6 border border-gold/20 bg-panel/40 p-6 backdrop-blur-[15px] sm:w-[360px] sm:p-8"
            >
              <span
                aria-hidden="true"
                className="absolute left-6 top-9 -translate-y-1/2 font-serif text-6xl leading-none text-gold-bright/20 sm:left-8"
              >
                &ldquo;
              </span>

              <p className="text-left font-jakarta text-sm italic leading-6 text-cream sm:text-base">
                {t.quote}
              </p>

              <div className="flex w-full items-center justify-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-[#3d392f] light:bg-[#eee] sm:size-12">
                  <span className="font-jakarta text-xs font-bold text-gold-bright sm:text-sm">
                    {t.initials}
                  </span>
                </div>
                <span className="font-jakarta text-xs uppercase tracking-[1.6px] text-cream-dim sm:text-sm">
                  {t.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
