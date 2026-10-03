import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Faq from "@/components/Faq";
import CTASection from "@/components/CTASection";
import HowItWorksProcess from "@/components/HowItWorksProcess";
import PageBanner from "@/components/PageBanner";

export const metadata: Metadata = {
  title: "How It Works | AUREX",
  description:
    "Discover how AUREX makes strategic investing simple, transparent, and seamless, from exploring carefully selected opportunities and understanding potential returns to applying, investing, and tracking your investment with confidence.",
};

/**
 * Standalone page for Figma node 110:13059 - a dedicated "How It Works"
 * page (title banner + a 4-step Process breakdown), distinct from the
 * anchor-scrolled `#how-it-works` summary section on the home page
 * (components/HowItWorks.tsx). Per request, built as its own route rather
 * than folded into that existing section.
 *
 * The FAQ, CTA, and Footer blocks in the Figma frame are pixel-for-pixel
 * the same copy already live in components/Faq.tsx, CTASection.tsx, and
 * Footer.tsx (same questions, same CTA copy, same footer links/contact
 * info) - reused directly here rather than re-authored, per the project's
 * "single source of truth" component convention. The title banner itself
 * is the shared components/PageBanner.tsx (also used by /contact), not a
 * page-specific component.
 *
 * The title banner is deliberately NOT inside the max-w-[1280px] padded
 * wrapper the rest of the page uses: per the Figma frame, the banner
 * ("Text Container", node 110:13581) is full-width across the page canvas
 * while every other section (Process/FAQ/CTA) is inset to a narrower
 * 1280px column - the same edge-to-edge-vs-inset distinction the design
 * draws between the navbar (also full-width) and everything below it. So
 * the horizontal padding/max-width constraint that main would normally
 * carry is pushed down onto just the inner wrapper, leaving the banner
 * free to span the true viewport width.
 *
 * <main>'s top padding is also NOT the site's usual pt-28/32/40 - that
 * value bakes in generous breathing room below the fixed Navbar, which is
 * right for sections that sit apart from it but wrong here: per Figma the
 * banner sits flush against the navbar with zero gap. pt-[72px]/[84px]
 * instead just clears Navbar's own rendered height (~72px with its mobile
 * logo crop below sm, ~84px with the larger crop from sm - matching its
 * own h-84px in the Figma source), so the banner starts exactly where the
 * fixed navbar ends instead of leaving a visible strip of page background
 * between them.
 */
export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center pb-16 pt-[72px] sm:pt-[84px]">
        <PageBanner
          title="How It Works"
          description="Discover how AUREX makes strategic investing simple, transparent, and seamless, from exploring carefully selected opportunities and understanding potential returns to applying, investing, and tracking your investment with confidence."
        />
        <div className="flex w-full max-w-[1280px] flex-col px-4 sm:px-6 lg:px-20">
          <HowItWorksProcess />
          <Faq />
          <CTASection />
        </div>
      </main>
      <Footer />
    </>
  );
}
