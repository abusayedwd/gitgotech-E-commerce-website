import SearchResults from "@/components/landingPage/SearchResults";
import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = createPageMetadata({
  title: "Search",
  description:
    "Search Sleeknit for products, vendors, and showrooms across the fashion marketplace.",
  path: "/search",
});

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black light:bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
