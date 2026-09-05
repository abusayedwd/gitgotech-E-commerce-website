import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Vendors",
  description:
    "Meet Sleeknit vendors and shop from independent fashion showrooms. Discover tailors and designers on the marketplace.",
  path: "/vendors",
});

export default function VendorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
