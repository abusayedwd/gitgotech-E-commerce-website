import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Log in",
  description: "Log in to your Sleeknit account to shop, track orders, or manage your vendor showroom.",
  path: "/auth/login",
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
