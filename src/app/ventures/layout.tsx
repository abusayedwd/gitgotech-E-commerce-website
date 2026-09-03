import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Ventures",
  description:
    "Explore Sleeknit ventures: vendors, showrooms, custom design requests, and tools for shopping and events.",
  path: "/ventures",
});

export default function VenturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
