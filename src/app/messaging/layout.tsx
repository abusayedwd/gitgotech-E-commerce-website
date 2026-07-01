import PrivateRoute from "@/components/shared/PrivateRoute";

export default function MessagingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
