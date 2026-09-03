import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Hot Deals",
  description:
    "Shop current Sleeknit hot deals on fashion from vendor showrooms. Limited-time discounts with delivery in 3–4 days.",
  path: "/hotdeals",
});

export default function HotDealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
