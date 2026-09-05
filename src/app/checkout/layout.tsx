import { NO_INDEX_ROBOTS } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: NO_INDEX_ROBOTS,
  title: "Dashboard",
};

export default function NoIndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
