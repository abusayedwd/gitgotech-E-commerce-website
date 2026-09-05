import PrivateRoute from "@/components/shared/PrivateRoute";
import { NO_INDEX_ROBOTS } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: NO_INDEX_ROBOTS,
  title: "Customer dashboard",
};

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
