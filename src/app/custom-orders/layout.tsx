import PrivateRoute from "@/components/shared/PrivateRoute";

export default function CustomOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
