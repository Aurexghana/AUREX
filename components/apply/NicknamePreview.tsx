import { TrendFlatIcon } from "@/components/icons";

// Placeholder rank/points for the preview only - nothing here knows (or
// should guess) the applicant's real future leaderboard standing, it's
// just demonstrating the row shape their nickname will actually appear
// in. Matches Leaderboard.tsx's own initials logic exactly (first two
// characters of the nickname, uppercased) rather than a different scheme
// invented just for this preview.
const PREVIEW_RANK = 12;
const PREVIEW_POINTS = "1,240";

/**
 * The exact Leaderboard row an applicant's nickname will render as -
 * originally the Investor flow's own Nickname-step live-preview markup,
 * extracted here (shared apply/, not flow-specific) once the Business
 * Owner flow needed the identical preview for its own Nickname step and
 * Review & Submit screen, rather than a lookalike copy that could quietly
 * drift out of sync with the original.
 *
 * `bare` drops this component's own card border/padding/background,
 * keeping only the row itself - for a caller that already sits inside its
 * own bordered container (a Review & Submit step's section card). Without
 * it, that section nested this card's border+padding inside its own,
 * which both looked like a redundant box-in-a-box and ate enough width on
 * narrow screens to truncate names that fit fine in the Nickname step's
 * own single-card context.
 */
export default function NicknamePreview({ nickname, bare = false }: { nickname: string; bare?: boolean }) {
  const trimmed = nickname.trim();
  const previewName = trimmed || "Your Nickname";
  const previewInitials = trimmed.slice(0, 2).toUpperCase() || "?";

  return (
    <div className={bare ? "" : "border border-gold/20 bg-panel/40 p-4"}>
      {/* gap-2 sm:gap-4 and the trend indicator's hidden sm:flex below are
          the one departure from a literal 1:1 copy of Leaderboard.tsx's
          row: the real leaderboard lives in a full-width section, while
          this preview sits inside the application flow's much narrower
          max-w-xl card (doubly so inside Step 5's own nested review
          section) - without shedding some width here first, a real name
          like "GoldFalcon" truncates to one or two characters on an
          actual phone, which defeats the entire point of a preview. The
          trend indicator ("Holding") is the one piece of this row that's
          decorative rather than identifying, so it's what gives way
          first, not the rank/avatar/name/points every rank actually cares
          about. */}
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="w-6 shrink-0 font-geist text-sm font-semibold text-cream-dim">{PREVIEW_RANK}</span>

        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-[#3d392f] light:bg-[#eee]">
          <span className="font-jakarta text-xs font-bold text-gold-bright">{previewInitials}</span>
        </div>

        <span
          className={`flex-1 truncate font-jakarta text-sm font-medium sm:text-base ${
            trimmed ? "text-cream" : "italic text-cream-dim"
          }`}
        >
          {previewName}
        </span>

        <span className="shrink-0 font-jakarta text-sm font-semibold text-gold-bright sm:text-base">
          {PREVIEW_POINTS} <span className="text-xs font-normal text-cream-dim">pts</span>
        </span>

        <span className="hidden shrink-0 items-center justify-end gap-1 text-neutral-500 sm:flex sm:w-14">
          <TrendFlatIcon className="size-2.5" />
          <span className="font-geist text-xs">Holding</span>
        </span>
      </div>
    </div>
  );
}
