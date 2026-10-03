"use client";

import { useTheme } from "@/lib/theme";

// Each variant's box scales down on mobile (~75% of its desktop size,
// same aspect ratio) and steps back up to the original figures from sm -
// full-size logos read as oversized against mobile-scaled nav/footer
// content, per request to bring "the logos" down to mobile scale too.
const VARIANTS = {
  // Navbar - 68x51 box, tall enough for icon + "AUREX" text.
  nav: {
    boxClassName: "w-[52px] h-[39px] sm:w-[68px] sm:h-[51px]",
    dark: "/brand/logo-mark-crop.png",
    light: "/brand/logo-mark-about-crop.png",
  },
  // Footer / CTA - 68x34 box. Too short to keep the wordmark text legible
  // (it was rendering as illegible noise beside the icon), so this variant
  // uses an icon-only crop instead - matching what the original export's
  // own footer-sized crop showed anyway.
  footer: {
    boxClassName: "w-[52px] h-[26px] sm:w-[68px] sm:h-[34px]",
    dark: "/brand/logo-mark-icon.png",
    light: "/brand/logo-mark-about-icon.png",
  },
  // Standalone centerpiece - e.g. the coming-soon page. Same icon+text
  // crop as `nav`, just scaled up (136x102, same 4:3-ish aspect).
  large: {
    boxClassName: "w-[104px] h-[78px] sm:w-[136px] sm:h-[102px]",
    dark: "/brand/logo-mark-crop.png",
    light: "/brand/logo-mark-about-crop.png",
  },
} as const;

/**
 * AUREX wordmark/icon. Theme-aware: the dark-mode exports render "AUREX"
 * in white text (invisible once the navbar/footer backgrounds go light in
 * light mode), so light mode swaps to dark-text exports instead.
 *
 * All four files are pre-cropped, purpose-made assets (see the crop
 * script in project history) that isolate just the icon, or icon +
 * "AUREX" text, out of the much larger original square/near-square
 * exports - those also include a tagline underneath that never needs to
 * show at this size, and don't share a common aspect ratio with each
 * other (nor with `boxClassName`'s own fixed ratio, which is one shared
 * shape for both).
 *
 * object-contain, not object-cover: the "AUREX" wordmark runs edge-to-edge
 * in every crop (the A and X sit flush against the image's own left/right
 * border), and every crop is wider than `boxClassName`'s box. object-cover
 * fills the box exactly by scaling to the box's height and cropping
 * whatever overflows the width - which sliced straight through the
 * leading A and trailing X on both sides, a truncated-looking logo.
 * object-contain scales to fit the whole image inside the box instead
 * (leaving a little empty vertical space rather than cropping), so the
 * full wordmark always renders intact.
 */
export default function BrandMark({ variant }: { variant: keyof typeof VARIANTS }) {
  const { boxClassName, dark, light } = VARIANTS[variant];
  const { theme } = useTheme();
  const src = theme === "light" ? light : dark;

  return (
    <div className={`relative shrink-0 overflow-hidden ${boxClassName}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="AUREX" src={src} className="absolute inset-0 size-full object-contain object-center" />
    </div>
  );
}
