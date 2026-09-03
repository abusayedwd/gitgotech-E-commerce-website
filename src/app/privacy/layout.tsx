import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "How Sleeknit collects, uses, and protects personal data for customers and vendors.",
  path: "/privacy",
});

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
