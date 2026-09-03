"use client";

import BannerSection from "@/components/landingPage/Banner";
import CategoryMarquee from "@/components/landingPage/CategoryMarquee";
import SimpleFAQ from "@/components/landingPage/FaQuestion";
import HotDealsSection from "@/components/landingPage/HotDeals";
import TopRated from "@/components/landingPage/TopRated";
import AdvertisementMarquee from "@/components/shared/AdvertisementMarquee";
import { AD_SECTION_BELOW_HEADER } from "@/lib/advertisement";

export default function Home() {
  return (
    <div className="overflow-x-hidden max-w-full mt-38 bg-linear-to-r from-gray-950 via-purple-900/20 to-black">
      <AdvertisementMarquee section={AD_SECTION_BELOW_HEADER} />
      <BannerSection />
      <CategoryMarquee />
      <HotDealsSection />
      <TopRated />
      <SimpleFAQ />
    </div>
  );
}
