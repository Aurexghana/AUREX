import type { SVGProps } from "react";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import { TrendFlatIcon } from "@/components/icons";

export type ApplicationStatus = "pending" | "approved" | "rejected";

function CheckmarkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5 12.5 10 17.5 19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Success icon (pending/approved) and neutral icon (rejected) share the
// same circular badge treatment - only the inner glyph and its tone
// change - so the two states read as "the same kind of message, different
// outcome" rather than one looking like an error state.
function StatusIcon({ status }: { status: ApplicationStatus }) {
  const isNeutral = status === "rejected";
  return (
    <div
      className={`flex size-16 shrink-0 items-center justify-center rounded-full border ${
        isNeutral ? "border-grid-line text-cream-dim" : "border-gold/30 bg-gold/10 text-gold-bright"
      }`}
    >
      {/* TrendFlatIcon - the same "neutral/no change" glyph Leaderboard.tsx
          and NicknamePreview already use - reused here rather than a new
          icon invented just for this one state, so "neutral" reads
          consistently across the app. */}
      {isNeutral ? <TrendFlatIcon className="size-6" /> : <CheckmarkIcon className="size-8" />}
    </div>
  );
}

type ApplicationStatusScreenProps = {
  status: ApplicationStatus;
  /** Public display name from the flow's own Nickname step - shown as-is,
   *  never the applicant's real name (this screen is reachable standalone,
   *  outside any authenticated context, so nothing private belongs on
   *  it). */
  nickname?: string;
  /** Already formatted for display (e.g. "+233 24 111 2233") - this
   *  component doesn't know or care about calling codes/libphonenumber,
   *  it just renders whatever string it's given, or omits the mention
   *  entirely if there isn't one. */
  phone?: string;
  /** The clause completing "we've received your application to ___" in
   *  the pending message - e.g. "invest with AUREX" (Investor flow) or
   *  "list Acme Foods on AUREX" (Business Owner flow). Kept as one
   *  free-form clause rather than a flow enum + businessName prop so this
   *  component doesn't need to know how many application flows exist or
   *  what makes each one's pending copy different. */
  purpose: string;
  /** e.g. "Investor Application" / "Business Owner Application" - used in
   *  the approved message ("your AUREX {applicationLabel} has been
   *  approved"). */
  applicationLabel: string;
  /** Where "Reapply" sends a rejected applicant - each flow's own start,
   *  e.g. /apply/investor or /apply-business. */
  reapplyHref: string;
  /** Where "Go to Dashboard" sends an approved applicant - each role's own
   *  dashboard, since Investors and Business Owners land on two entirely
   *  separate screens (see components/dashboard/ vs components/dashboard/
   *  business/). Defaults to /dashboard (the Investor Dashboard) so the
   *  Investor flow's own call sites don't need to pass this explicitly. */
  dashboardHref?: string;
};

/**
 * Shared terminal screen for both application flows (Investor and Business
 * Owner) - reachable two ways per flow:
 *   - As that flow's own last step, immediately after a successful
 *     submission (see each flow's ConfirmationStep.tsx, which always
 *     passes status="pending" - there's no real review process yet to
 *     have already reached a verdict).
 *   - As that flow's own standalone route (/apply/status,
 *     /apply-business/status) for a returning applicant checking on an
 *     application submitted earlier - there's no backend/auth yet to look
 *     one up for real, so those pages vary `status` via a stub
 *     query-string source instead.
 *
 * Deliberately doesn't reuse either flow's MultiStepFormShell chrome at
 * all (no progress bar, no Back/Continue) - this is an endpoint, not a
 * step the applicant is filling out, and it needs to render identically
 * whether or not a shell is even mounted.
 */
export default function ApplicationStatusScreen({
  status,
  nickname,
  phone,
  purpose,
  applicationLabel,
  reapplyHref,
  dashboardHref = "/dashboard",
}: ApplicationStatusScreenProps) {
  const name = nickname?.trim() || "there";

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex w-full max-w-xl flex-col items-center gap-8">
        <Link href="/" aria-label="AUREX home">
          <BrandMark variant="nav" />
        </Link>

        <div className="flex flex-col items-center gap-6 border border-gold/20 bg-panel/40 p-8 text-center backdrop-blur-2xl sm:p-12">
          <StatusIcon status={status} />

          {status === "pending" && (
            <div className="flex flex-col gap-3">
              <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Application Received!</h1>
              <p className="font-sans text-sm text-cream-dim sm:text-base">
                Thanks, {name}, we&apos;ve received your application to {purpose}.
              </p>
              <p className="font-sans text-sm text-cream-dim sm:text-base">
                Our admin team will review your application and reach out to you via WhatsApp
                {phone ? ` at ${phone}` : ""} once it&apos;s approved.
              </p>
              <p className="font-sans text-xs text-cream-dim/70">Reviews typically take a few business days.</p>
            </div>
          )}

          {status === "approved" && (
            <div className="flex flex-col gap-3">
              <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">You&apos;re Approved!</h1>
              <p className="font-sans text-sm text-cream-dim sm:text-base">
                Congratulations, {name}, your AUREX {applicationLabel} has been approved.
              </p>
              <p className="font-sans text-sm text-cream-dim sm:text-base">
                You can now access your dashboard for next steps.
              </p>
            </div>
          )}

          {status === "rejected" && (
            <div className="flex flex-col gap-3">
              <h1 className="font-jakarta text-2xl font-semibold text-cream sm:text-3xl">Application Update</h1>
              <p className="font-sans text-sm text-cream-dim sm:text-base">
                Thank you for applying, {name}. After careful review, we&apos;re not able to move forward with your
                application at this time.
              </p>
              <p className="font-sans text-sm text-cream-dim sm:text-base">
                This isn&apos;t necessarily final; you&apos;re welcome to reapply in the future as your
                circumstances or our review criteria change.
              </p>
            </div>
          )}

          {status === "approved" && (
            <Link
              href={dashboardHref}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3 font-jakarta text-sm font-medium text-amainblack transition-opacity hover:opacity-90"
            >
              Go to Dashboard
            </Link>
          )}

          {status === "rejected" && (
            <Link
              href={reapplyHref}
              className="flex items-center justify-center gap-2 border border-gold-muted/40 px-6 py-3 font-jakarta text-sm font-medium text-gold-bright transition-colors hover:bg-gold-bright/10"
            >
              Reapply
            </Link>
          )}

          {/* "Back to Home" - the pending state (what every applicant
              actually sees right after submitting; see this component's
              own comment) previously had no way out of this screen at all
              besides the browser's own Back button. Approved/rejected
              already have their own primary action above, so this is a
              lighter secondary link there rather than a second competing
              button. */}
          {status === "pending" ? (
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3 font-jakarta text-sm font-medium text-amainblack transition-opacity hover:opacity-90"
            >
              Back to Home
            </Link>
          ) : (
            <Link
              href="/"
              className="font-jakarta text-sm font-medium text-cream-dim underline-offset-4 transition-colors hover:text-gold-light hover:underline"
            >
              Back to Home
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
