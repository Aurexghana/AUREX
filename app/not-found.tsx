import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFoundContent from "@/components/NotFoundContent";

export const metadata: Metadata = {
  title: "Page Not Found | AUREX",
  description: "The page you're looking for doesn't exist or may have been moved.",
};

/**
 * App Router's dedicated 404 file - automatically rendered for any
 * unmatched URL (and for a manual notFound() call, if one's ever added),
 * replacing Next's bare default 404 with the site's own branded page.
 * Same page chrome (Navbar/Footer) and section-card layout as
 * /coming-soon so a mistyped or dead link still feels like part of the
 * site instead of a generic framework error page.
 */
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-20 lg:pt-40">
        <div className="flex w-full max-w-[1280px] flex-col">
          <NotFoundContent />
        </div>
      </main>
      <Footer />
    </>
  );
}
