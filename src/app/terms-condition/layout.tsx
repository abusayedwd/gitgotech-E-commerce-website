import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Terms and Conditions",
  description:
    "Terms for using the Sleeknit fashion marketplace, including orders, vendors, and custom designs.",
  path: "/terms-condition",
});

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
