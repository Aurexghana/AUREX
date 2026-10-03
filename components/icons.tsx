import type { SVGProps } from "react";

/**
 * Small monochrome vector icons reproduced exactly from the Figma design's
 * exported SVG assets (see public/brand/icon-*.svg for the originals).
 * `fill` is left as `currentColor` so each icon inherits its button/label's
 * text color instead of hardcoding the design's literal hex per instance.
 */

export function ArrowUpRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16.6667 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1.16667 10L0 8.83333L6.16667 2.625L9.5 5.95833L13.8333 1.66667H11.6667V0H16.6667V5H15V2.83333L9.5 8.33333L6.16667 5L1.16667 10V10"
        fill="currentColor"
      />
    </svg>
  );
}

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7 0L6.285 0.6965L10.075 4.5H0V5.5H10.075L6.285 9.2865L7 10L12 5L7 0Z" fill="currentColor" />
    </svg>
  );
}

export function AumIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M0 18V16L2 14V18H0V18M4 18V12L6 10V10V18H4V18M8 18V10L10 12.025V18H8V18M12 18V12.025L14 10.025V18H12V18M16 18V8L18 6V18H16V18M0 12.825V10L7 3L11 7L18 0V2.825L11 9.825L7 5.825L0 12.825V12.825"
        fill="currentColor"
      />
    </svg>
  );
}

export function TrendUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 13.3333 13.3333" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M5.83333 13.3333V3.1875L1.16667 7.85417L0 6.66667L6.66667 0L13.3333 6.66667L12.1667 7.85417L7.5 3.1875V13.3333H5.83333V13.3333"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * TrendDownIcon / TrendFlatIcon - not from Figma (there's no leaderboard
 * design there; this section was built from the user's own spec). Kept in
 * the same shape/viewBox family as TrendUpIcon (a plain vertical arrow)
 * rather than a diagonal one, and a simple centered bar for "held
 * position", so the three read as one consistent set on the Leaderboard
 * rank-change indicator.
 */
export function TrendDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 13.3333 13.3333" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M7.5 0V10.1458L12.1667 5.47917L13.3333 6.66667L6.66667 13.3333L0 6.66667L1.16667 5.47917L5.83333 10.1458V0H7.5V0"
        fill="currentColor"
      />
    </svg>
  );
}

export function TrendFlatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 13.3333 13.3333" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M0 6.16667H13.3333V7.83333H0V6.16667V6.16667" fill="currentColor" />
    </svg>
  );
}

/**
 * Originally one of four "Why Aurex" feature icons (Figma node 85:11775) -
 * the other three (Exclusivity/Transparency/Growth) were removed once that
 * section switched from a small centered icon per card to a real photo
 * (see components/WhyAurex.tsx's own comment on why). This one lives on
 * because it's also reused for a "your documents are handled securely"
 * note on the apply flow's ID Upload steps (components/apply/investor/
 * IdUploadStep.tsx, components/apply/business/DocumentUploadStep.tsx).
 */
export function SecurityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M10.425 20.325L18.9 11.85L16.7625 9.7125L10.425 16.05L7.275 12.9L5.1375 15.0375L10.425 20.325V20.325M12 30C8.525 29.125 5.65625 27.1312 3.39375 24.0187C1.13125 20.9062 0 17.45 0 13.65V4.5L12 0L24 4.5V13.65C24 17.45 22.8688 20.9062 20.6063 24.0187C18.3438 27.1312 15.475 29.125 12 30V30M12 26.85C14.6 26.025 16.75 24.375 18.45 21.9C20.15 19.425 21 16.675 21 13.65V6.5625L12 3.1875L3 6.5625V13.65C3 16.675 3.85 19.425 5.55 21.9C7.25 24.375 9.4 26.025 12 26.85V26.85"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Generic document icon - not from Figma; introduced for the Investor
 * Application's ID Upload step (a document-type file's fallback preview),
 * and reused by its Review & Submit step (confirming a file is attached
 * without re-rendering the document itself) rather than each defining its
 * own copy.
 */
export function DocumentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6 2.5h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-17a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M14 2.5v4h4M8 13h8M8 16.5h8M8 9.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** FAQ accordion chevron - per Figma node 85:11702. */
export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 12 7.4" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6 7.4L0 1.4L1.4 0L6 4.6L10.6 0L12 1.4L6 7.4V7.4" fill="currentColor" />
    </svg>
  );
}

/**
 * Footer icons - reproduced inline rather than referenced as <img> files.
 * The exported public/brand/icon-{social-1,social-2,social-3,email,phone}.svg
 * assets all carry `preserveAspectRatio="none"`, so any container that isn't
 * exactly square (e.g. a flex item getting shrunk unevenly on narrow
 * viewports) visibly stretches them. Inline components default to
 * aspect-preserving behavior, which fixes that regardless of container size.
 */

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M20 10C20 4.47715 15.5229 0 10 0C4.47715 0 0 4.47715 0 10C0 14.9912 3.65684 19.1283 8.4375 19.8785V12.8906H5.89844V10H8.4375V7.79688C8.4375 5.29063 9.93047 3.90625 12.2146 3.90625C13.3084 3.90625 14.4531 4.10156 14.4531 4.10156V6.5625H13.1922C11.95 6.5625 11.5625 7.3334 11.5625 8.125V10H14.3359L13.8926 12.8906H11.5625V19.8785C16.3432 19.1283 20 14.9912 20 10Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6.2918 18.125C13.8371 18.125 17.9652 11.8723 17.9652 6.45159C17.9652 6.27581 17.9613 6.09612 17.9535 5.92034C18.7566 5.33959 19.4496 4.62025 20 3.79612C19.2521 4.12887 18.458 4.34619 17.6449 4.44065C18.5011 3.92746 19.1421 3.12126 19.4492 2.17151C18.6438 2.64883 17.763 2.98555 16.8445 3.16721C16.2257 2.50967 15.4075 2.0743 14.5164 1.92841C13.6253 1.78252 12.711 1.93425 11.9148 2.36012C11.1186 2.78599 10.4848 3.46229 10.1115 4.28446C9.73825 5.10663 9.64619 6.02888 9.84961 6.90862C8.21874 6.82678 6.62328 6.40312 5.16665 5.66512C3.71002 4.92711 2.42474 3.89123 1.39414 2.62463C0.870333 3.52774 0.710047 4.59641 0.945859 5.61345C1.18167 6.63048 1.79589 7.51958 2.66367 8.10002C2.01219 8.07934 1.37498 7.90394 0.804688 7.58831V7.63909C0.804104 8.58683 1.13175 9.50553 1.73192 10.239C2.3321 10.9725 3.16777 11.4755 4.09687 11.6625C3.49338 11.8276 2.85999 11.8517 2.2457 11.7328C2.50788 12.5479 3.01798 13.2608 3.70481 13.772C4.39164 14.2832 5.22093 14.5672 6.07695 14.5844C4.62369 15.726 2.82848 16.3451 0.980469 16.3422C0.652739 16.3417 0.325333 16.3216 0 16.2821C1.87738 17.4865 4.06128 18.1262 6.2918 18.125Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.5195 0H1.47656C0.660156 0 0 0.644531 0 1.44141V18.5547C0 19.3516 0.660156 20 1.47656 20H18.5195C19.3359 20 20 19.3516 20 18.5586V1.44141C20 0.644531 19.3359 0 18.5195 0ZM5.93359 17.043H2.96484V7.49609H5.93359V17.043ZM4.44922 6.19531C3.49609 6.19531 2.72656 5.42578 2.72656 4.47656C2.72656 3.52734 3.49609 2.75781 4.44922 2.75781C5.39844 2.75781 6.16797 3.52734 6.16797 4.47656C6.16797 5.42187 5.39844 6.19531 4.44922 6.19531ZM17.043 17.043H14.0781V12.4023C14.0781 11.2969 14.0586 9.87109 12.5352 9.87109C10.9922 9.87109 10.7578 11.0781 10.7578 12.3242V17.043H7.79688V7.49609H10.6406V8.80078H10.6797C11.0742 8.05078 12.043 7.25781 13.4844 7.25781C16.4883 7.25781 17.043 9.23438 17.043 11.8047V17.043V17.043Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function EmailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1.25 7.22425V14.375C1.25 15.7557 2.36929 16.875 3.75 16.875H16.25C17.6307 16.875 18.75 15.7557 18.75 14.375V7.22425L11.3102 11.8026C10.5067 12.297 9.49327 12.297 8.68976 11.8026L1.25 7.22425Z"
        fill="currentColor"
      />
      <path
        d="M18.75 5.75652V5.625C18.75 4.24429 17.6307 3.125 16.25 3.125H3.75C2.36929 3.125 1.25 4.24429 1.25 5.625V5.75652L9.34488 10.738C9.74664 10.9852 10.2534 10.9852 10.6551 10.738L18.75 5.75652Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.25 3.75C1.25 2.36929 2.36929 1.25 3.75 1.25H4.89302C5.61 1.25 6.23498 1.73796 6.40887 2.43354L7.33037 6.11952C7.48284 6.72942 7.25495 7.37129 6.75202 7.74849L5.674 8.557C5.56206 8.64096 5.53772 8.7639 5.56917 8.84974C6.51542 11.4329 8.5671 13.4846 11.1503 14.4308C11.2361 14.4623 11.359 14.4379 11.443 14.326L12.2515 13.248C12.6287 12.7451 13.2706 12.5172 13.8805 12.6696L17.5665 13.5911C18.262 13.765 18.75 14.39 18.75 15.107V16.25C18.75 17.6307 17.6307 18.75 16.25 18.75H14.375C7.12626 18.75 1.25 12.8737 1.25 5.625V3.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Unlike every icon above, these two have no Figma source (there's no
// password-visibility control anywhere in the design file) - stroke-based
// rather than this file's usual filled-path reproduction, since that's
// how a show/hide-password glyph is conventionally drawn everywhere it
// appears. Shapes follow the widely-used Feather Icons "eye"/"eye-off"
// glyphs (MIT licensed) rather than inventing new ones from scratch.
export function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function EyeOffIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1 1l22 22" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
