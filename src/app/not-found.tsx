import FallbackScreen from "@/components/shared/FallbackScreen";
import { NO_INDEX_ROBOTS, SITE_NAME } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description: `This page is not in the ${SITE_NAME} collection. Head home or shop hot deals, vendors, and showrooms.`,
  robots: NO_INDEX_ROBOTS,
};

export default function NotFound() {
  return <FallbackScreen variant="not-found" />;
}
