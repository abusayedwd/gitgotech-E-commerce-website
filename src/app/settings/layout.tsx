import PrivateRoute from "@/components/shared/PrivateRoute";
import { NO_INDEX_ROBOTS } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: NO_INDEX_ROBOTS,
  title: "Settings",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
