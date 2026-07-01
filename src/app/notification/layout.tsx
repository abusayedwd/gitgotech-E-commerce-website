import PrivateRoute from "@/components/shared/PrivateRoute";

export default function NotificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
