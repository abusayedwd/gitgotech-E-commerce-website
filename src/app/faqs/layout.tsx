import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers about Sleeknit delivery (3–4 days), pickup, returns, custom designs, vendor accounts, and support.",
  path: "/faqs",
});

export default function FaqsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
