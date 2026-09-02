"use client";

import BannerSection from "@/components/landingPage/Banner";
import CategoryMarquee from "@/components/landingPage/CategoryMarquee";
import SimpleFAQ from "@/components/landingPage/FaQuestion";
import HotDealsSection from "@/components/landingPage/HotDeals";
import TopRated from "@/components/landingPage/TopRated";

export default function Home() {
  return (
    <div className="overflow-x-hidden max-w-full">
      <BannerSection />
      <CategoryMarquee />
      <HotDealsSection />
      <TopRated />
      <SimpleFAQ />
    </div>
  );
}
