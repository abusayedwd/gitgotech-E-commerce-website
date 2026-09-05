import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Showrooms",
  description:
    "Browse Sleeknit showrooms and curated fashion collections from vendors around the world.",
  path: "/showroom",
});

export default function ShowroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
