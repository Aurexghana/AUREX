import { ArrowUpRightIcon } from "@/components/icons";
import { getListingChangeRequestWhatsAppLink } from "@/lib/whatsapp";
import type { BusinessListing } from "@/lib/businessListing";

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-sans text-xs uppercase tracking-wide text-cream-dim">{label}</span>
      <p className="font-sans text-sm leading-6 text-cream">{value}</p>
    </div>
  );
}

/**
 * Read-only, on purpose - there are no inputs, no edit buttons, nothing
 * clickable on the listing's own content anywhere in this section. Only
 * Admin can change a listing's details, so the one action offered is a
 * WhatsApp hand-off to ask for a change, not an in-dashboard form (same
 * "no in-platform action, route to Admin on WhatsApp" pattern the
 * Investor Dashboard's own Invest button uses).
 */
export default function ListingDetailsSection({
  listing,
  whatsappNumber,
}: {
  listing: BusinessListing;
  whatsappNumber: string | null;
}) {
  return (
    <section className="flex flex-col gap-6 border border-grid-line bg-panel/20 p-6 sm:p-8">
      <h2 className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">Business Listing Details</h2>

      <div className="flex flex-col gap-5">
        <DetailField label="Business Name" value={listing.businessName} />
        <DetailField label="Description" value={listing.description} />
        <DetailField label="Funding Purpose" value={listing.fundingPurpose} />
      </div>

      <div className="flex flex-col gap-3 border-t border-grid-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-sm text-cream-dim">To request changes to your listing, contact AUREX admin.</p>
        {whatsappNumber && (
          <a
            href={getListingChangeRequestWhatsAppLink(whatsappNumber, listing.businessName)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit items-center gap-1.5 font-jakarta text-sm font-medium text-gold-bright underline-offset-4 transition-colors hover:text-gold-light hover:underline"
          >
            Contact Admin on WhatsApp
            <ArrowUpRightIcon className="size-3" />
          </a>
        )}
      </div>
    </section>
  );
}
