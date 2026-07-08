"use client";

import BannerSection from "@/components/landingPage/Banner";
import CategoryMarquee from "@/components/landingPage/CategoryMarquee";
import SimpleFAQ from "@/components/landingPage/FaQuestion";
import HotDealsSection from "@/components/landingPage/HotDeals";
import SearchResults from "@/components/landingPage/SearchResults";
import TopRated from "@/components/landingPage/TopRated";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function HomeBody() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") || "").trim();

  // When a search query is present, hide the normal home sections and show
  // search results in their place. The search bar (FashionSearchNav) stays
  // mounted globally via the layout, so users can keep typing.
  if (q) {
    return <SearchResults />;
  }

  return (
    <>
      <BannerSection />
      <CategoryMarquee />
      <HotDealsSection />
      <TopRated />
      <SimpleFAQ />
    </>
  );
}

export default function Home() {
  return (
    <div className="overflow-x-hidden max-w-full">
      <Suspense fallback={null}>
        <HomeBody />
      </Suspense>
    </div>
  );
}
