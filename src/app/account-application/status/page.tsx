import AccountApplicationStatus from "@/components/accountApplication/AccountApplicationStatus";
import { NO_INDEX_ROBOTS } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor application status",
  robots: NO_INDEX_ROBOTS,
};

export default function AccountApplicationStatusPage() {
  return <AccountApplicationStatus />;
}
