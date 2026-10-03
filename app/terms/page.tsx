import type { Metadata } from "next";
import { LegalPageShell, AccordionSection, Paragraph, BulletList } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Terms and Conditions | AUREX",
  description: "The terms and conditions governing use of the AUREX platform.",
};

// TODO: Replace with the real Terms and Conditions markdown once it's
// provided - everything below this line is placeholder legal content
// standing in for it, per the brief ("treat it as placeholder legal
// content that will be finalized after legal review, not final copy").
// Update LAST_UPDATED alongside the real content when that swap happens.
const LAST_UPDATED = "27 August 2026";

/**
 * Standalone /terms page - reached from the site footer's "Terms and
 * Conditions" link (see Footer.tsx) and accessible to anyone, no auth
 * required (there's no auth on this site at all yet, but this page in
 * particular is meant to stay public even once one exists).
 *
 * Shell/typography (logo+back-link header, title block, cross-link
 * footer, and each section's own AccordionSection/Paragraph/BulletList)
 * lives in components/legal/LegalDocument.tsx, shared with /privacy -
 * this file only owns which sections go here and in what order.
 */
export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms and Conditions"
      lastUpdated={LAST_UPDATED}
      crossLink={{ label: "Privacy Policy", href: "/privacy" }}
    >
      <AccordionSection title="1. Introduction" defaultOpen>
        <Paragraph>
          These Terms and Conditions (&quot;Terms&quot;) govern access to and use of the AUREX platform, including
          our website, application flows, and member dashboards (together, the &quot;Platform&quot;). By creating an
          account, submitting an application, or otherwise using the Platform, you agree to be bound by these Terms.
        </Paragraph>
      </AccordionSection>

      <AccordionSection title="2. Eligibility">
        <Paragraph>
          You must be at least 18 years old and legally capable of entering into binding contracts in your
          jurisdiction to use the Platform. By applying as an Investor or listing a business as a Business Owner,
          you represent that the information you provide is accurate and complete.
        </Paragraph>
      </AccordionSection>

      <AccordionSection title="3. Investor Applications and Membership">
        <Paragraph>
          Submitting an Investor Application does not guarantee approval or membership. AUREX reviews every
          application at its own discretion, and reserves the right to approve, reject, or request further
          information before making a decision.
        </Paragraph>
        <BulletList
          items={[
            "Approved investors may be offered access to AUREX Core and AUREX Ventures investment slots.",
            "Investment amounts, terms, and interest rates are set and recorded by AUREX Admin and may vary between slots.",
            "AUREX does not process payments in-platform; all investment arrangements are confirmed directly with an AUREX representative.",
          ]}
        />
      </AccordionSection>

      <AccordionSection title="4. Business Owner Listings">
        <Paragraph>
          Businesses listed on the Platform are reviewed and published at AUREX&apos;s discretion. A Business
          Owner&apos;s public listing (business name, description, and funding purpose) may be shown to prospective
          investors; identifying applicant details are kept private and visible only to AUREX Admin. Only AUREX
          Admin may edit a published listing&apos;s details.
        </Paragraph>
      </AccordionSection>

      <AccordionSection title="5. Investment Risk">
        <Paragraph>
          All investments carry risk, including the potential loss of principal. Past performance of any package or
          business is not a guarantee of future results. You should seek independent financial advice before making
          any investment decision through the Platform.
        </Paragraph>
      </AccordionSection>

      <AccordionSection title="6. Privacy and Data">
        <Paragraph>
          Information collected during an application (including identity documents) is used solely to verify
          applications and administer memberships, and is shared only with AUREX Admin, not with other members or
          the public, except where you&apos;ve explicitly consented to a detail (such as a nickname) being shown
          publicly. See our Privacy Policy for the full detail on how this information is handled.
        </Paragraph>
      </AccordionSection>

      <AccordionSection title="7. Limitation of Liability">
        <Paragraph>
          To the fullest extent permitted by law, AUREX shall not be liable for any indirect, incidental, or
          consequential damages arising from your use of the Platform or any investment made through it.
        </Paragraph>
      </AccordionSection>

      <AccordionSection title="8. Changes to These Terms">
        <Paragraph>
          AUREX may update these Terms from time to time. Continued use of the Platform after an update constitutes
          acceptance of the revised Terms. Material changes will be reflected in the &quot;Last updated&quot; date
          above.
        </Paragraph>
      </AccordionSection>

      <AccordionSection title="9. Contact">
        <Paragraph>
          Questions about these Terms can be sent to{" "}
          <a href="mailto:hello@aurexgh.com" className="text-gold-bright underline-offset-4 hover:underline">
            hello@aurexgh.com
          </a>
          .
        </Paragraph>
      </AccordionSection>
    </LegalPageShell>
  );
}
