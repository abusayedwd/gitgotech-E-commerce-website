import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Vendors | SleeKnit",
  description:
    "Discover our elite designers and featured tailors. Browse top-rated vendors offering premium fashion and custom designs.",
};

export default function TopVendorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
