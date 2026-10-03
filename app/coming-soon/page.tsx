import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComingSoonContent from "@/components/ComingSoonContent";

export const metadata: Metadata = {
  title: "Coming Soon | AUREX",
  description: "This part of AUREX is on its way. Check back soon.",
};

/**
 * Shared destination for every nav item, footer link, and CTA that
 * doesn't have a real page behind it yet - this build only fleshes out
 * the home page (Hero/About/Packages/Client Perspectives/CTA). Rather
 * than leaving those as dead "#" anchors that silently do nothing, they
 * route here so visiting them gives real feedback instead.
 *
 * Content lives in components/ComingSoonContent.tsx (a client component)
 * so this file can stay a plain Server Component and export `metadata` -
 * same split used by app/not-found.tsx + components/NotFoundContent.tsx.
 */
export default function ComingSoonPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-20 lg:pt-40">
        <div className="flex w-full max-w-[1280px] flex-col">
          <ComingSoonContent />
        </div>
      </main>
      <Footer />
    </>
  );
}
