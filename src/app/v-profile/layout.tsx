import PrivateRoute from "@/components/shared/PrivateRoute";

export default function VendorProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
