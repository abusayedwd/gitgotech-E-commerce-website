import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "New Arrivals",
  description:
    "See the newest fashion drops on Sleeknit. Shop fresh designs from vendor showrooms as they arrive.",
  path: "/new-arrivals",
});

export default function NewArrivalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
