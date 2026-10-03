"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/lib/theme";

/**
 * The "Looper BG" decorative vector behind the hero, reproduced from its
 * exported SVG asset (already gold/white-gradient toned in the source file
 * - see public/brand/looper-bg.svg). Per request: this specific vector
 * glows gold as the cursor moves near/along it. The general sitewide
 * cursor-glow has been turned off - this replaces it, scoped to just this
 * graphic.
 *
 * Implementation: the same image is layered twice - a dim resting copy,
 * and a brightened+glowing copy revealed only within a soft radius around
 * the pointer via a CSS radial-gradient mask. The mask position is written
 * directly to the DOM on pointermove (no React state) to stay smooth.
 * Skipped for touch input and prefers-reduced-motion.
 *
 * The resting copy's own asset (looper-bg.svg) carries near-zero baked-in
 * path opacity - fine against the dark theme's near-black page, where even
 * a faint pale stroke shows up, but against the light theme it was
 * reading as fully invisible: no CSS filter can raise an SVG's own alpha,
 * so it stayed invisible until the boosted-opacity hover layer kicked in
 * ("not visible unless I hover on it"). Light mode's resting copy swaps to
 * that same boosted-opacity asset instead (looper-bg-glow.svg - the one
 * the hover glow already uses), dimmed down with a real opacity + a
 * darkening filter so it reads as quiet background linework rather than
 * the bright lit-up hover state.
 *
 * Dark mode's resting copy gets a mild brightness boost on top of its own
 * baked-in opacity (per request that it read a bit lighter at rest,
 * before the pointer-glow kicks in) - still nowhere near the hover
 * layer's own brightness(2.2)+drop-shadow treatment, just enough for the
 * resting linework to read a little more clearly against the dark page.
 *
 * NOTE: a Figma-designed wave/dot/gold-tint texture was briefly tried here
 * for light mode (and on Leaderboard/How It Works/Contact) - reverted
 * everywhere per request; none of those sections' light-mode backgrounds
 * were supposed to change. This component's own light-mode linework
 * treatment below is back to what it was before that attempt.
 */
export default function HeroLooperVector() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const glow = glowRef.current;
    if (!wrapper || !glow) return;

    // Chromium drops the `at <var> <var>` position clause of a
    // radial-gradient mask when it's set via an HTML style ATTRIBUTE
    // string (i.e. a JSX inline `style` object) - reproducible in
    // isolation, unrelated to React/Tailwind. Assigning the identical
    // value through the CSSOM property setter works correctly and keeps
    // tracking live updates to the custom properties afterward, so the
    // mask is wired up here in JS rather than via JSX style.
    glow.style.setProperty("--glow-x", "50%");
    glow.style.setProperty("--glow-y", "50%");
    const maskValue =
      "radial-gradient(circle 260px at var(--glow-x) var(--glow-y), black, transparent 65%)";
    glow.style.maskImage = maskValue;
    glow.style.setProperty("-webkit-mask-image", maskValue);

    if (prefersReducedMotion) return;
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    const ROTATION_RAD = (10.92 * Math.PI) / 180;
    const cos = Math.cos(ROTATION_RAD);
    const sin = Math.sin(ROTATION_RAD);

    const handleMove = (event: PointerEvent) => {
      // getBoundingClientRect() returns the axis-aligned box AFTER rotation,
      // so its top-left is NOT the element's local (0,0) origin - only its
      // center is reliable (rotation pivots on the center, which is
      // invariant under the transform). Take the mouse vector from that
      // center in viewport space, rotate it by -θ to undo the transform,
      // then re-add half width/height to land in the image's own
      // (unrotated) local coordinate space that the mask actually uses.
      const rect = wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const localDx = dx * cos + dy * sin;
      const localDy = -dx * sin + dy * cos;
      const x = localDx + wrapper.offsetWidth / 2;
      const y = localDy + wrapper.offsetHeight / 2;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        glow.style.setProperty("--glow-x", `${x}px`);
        glow.style.setProperty("--glow-y", `${y}px`);
        glow.style.opacity = "1";
      });
    };

    const handleLeaveWindow = () => {
      glow.style.opacity = "0";
    };

    // Listen on window (bubbles from anywhere, including over foreground
    // text/buttons) so the glow tracks correctly even where UI sits above
    // the vector, using the vector's own bounding rect for the math.
    window.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerleave", handleLeaveWindow);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerleave", handleLeaveWindow);
      cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none absolute -left-[27%] -top-[46%] hidden h-[1396px] w-[2260px] rotate-[10.92deg] opacity-90 md:block"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={isLight ? "/brand/looper-bg-glow.svg" : "/brand/looper-bg.svg"}
        alt=""
        className="absolute inset-0 size-full"
        style={
          isLight
            ? { opacity: 0.22, filter: "brightness(0.68) saturate(1.7) contrast(1.02)" }
            : { filter: "brightness(1.6) saturate(1.15)" }
        }
      />

      {/* Always rendered (never gated on prefersReducedMotion in JSX):
          useReducedMotion() resolves differently between the server render
          and the client's first paint, so conditionally rendering this on
          its value caused a real hydration mismatch. Reduced-motion is
          instead handled entirely in the effect below (which never wires
          up the pointer listeners in that case), so this div's opacity
          simply never leaves 0 - invisible without ever diverging from
          the server-rendered markup. */}
      <div ref={glowRef} className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-out">
        {/* Uses looper-bg-glow.svg, a boosted-opacity/thicker-stroke
            variant generated from the same source paths - NOT just a
            CSS-filtered copy of the resting asset. The resting SVG's
            strokes carry very low stroke-opacity/opacity (down to 0.01),
            and CSS brightness()/saturate() only scale color, never
            alpha - so no filter on the original asset could make a
            near-transparent stroke actually visible against the dark
            background. Boosting real opacity in the asset itself is
            what makes the lines legible when lit. Brightness/saturate
            here just add the final gold pop and glow bloom on top of an
            already-visible line. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/looper-bg-glow.svg"
          alt=""
          className="absolute inset-0 size-full"
          style={{
            filter:
              "brightness(2.2) saturate(1.8) drop-shadow(0 0 3px rgba(255,223,140,0.95)) drop-shadow(0 0 14px rgba(233,195,73,0.9)) drop-shadow(0 0 32px rgba(212,175,55,0.6))",
          }}
        />
      </div>
    </div>
  );
}
