import PrivateRoute from "@/components/shared/PrivateRoute";
import { NO_INDEX_ROBOTS } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: NO_INDEX_ROBOTS,
  title: "Vendor profile",
};

export default function VendorProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
