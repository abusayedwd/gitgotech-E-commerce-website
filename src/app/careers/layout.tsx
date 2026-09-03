import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Careers",
  description:
    "Join the Sleeknit team. Browse open roles in fashion, marketplace operations, and digital product.",
  path: "/careers",
});

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
