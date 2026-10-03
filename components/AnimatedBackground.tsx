"use client";

/**
 * Shared decorative backdrop for the whole app. Used to carry the AUREX
 * "Ambient Lighting Effects" from the Figma design - a soft gold glow
 * behind the hero, a warm highlight bleeding in from the top right, and a
 * dark umber bloom bleeding in from the bottom left - all three removed per
 * request ("remove all golden glows happening in the bg of this platform").
 * What's left is just the faint full-bleed vignette overlay from the same
 * design (a ~2%-opacity black gradient, not gold - see public/brand/
 * ambient-lighting.svg), which adds a touch of depth without reading as a
 * glow.
 *
 * Rendered once in the root layout, behind every page. aria-hidden and
 * pointer-events-none so it never affects a11y or interaction.
 */
export default function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        src="/brand/ambient-lighting.svg"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
