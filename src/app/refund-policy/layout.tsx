import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Refund Policy",
  description:
    "Sleeknit refund and return rules for delivered orders, including the return window and processing deductions.",
  path: "/refund-policy",
});

export default function RefundPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
