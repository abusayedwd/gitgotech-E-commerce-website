import PrivateRoute from "@/components/shared/PrivateRoute";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
