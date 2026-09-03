import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Create an account",
  description:
    "Sign up for Sleeknit as a customer or vendor. Shop fashion, request custom designs, or open your own showroom.",
  path: "/auth/sign-up",
});

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
