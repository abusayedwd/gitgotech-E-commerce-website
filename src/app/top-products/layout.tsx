import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Top Products",
  description:
    "Browse top-rated fashion on Sleeknit. Shop popular clothing from trusted vendor showrooms.",
  path: "/top-products",
});

export default function TopProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
