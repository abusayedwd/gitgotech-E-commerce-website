import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "About Us",
  description:
    "Sleeknit is a global fashion marketplace where customers shop premium designs, request custom tailoring, and buy from independent vendor showrooms.",
  path: "/about",
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
