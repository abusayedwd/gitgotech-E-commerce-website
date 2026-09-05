import VendorDashboardShell from "./VendorDashboardShell";
import { NO_INDEX_ROBOTS } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: NO_INDEX_ROBOTS,
  title: "Vendor dashboard",
};

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VendorDashboardShell>{children}</VendorDashboardShell>;
}
