import PrivateRoute from "@/components/shared/PrivateRoute";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
