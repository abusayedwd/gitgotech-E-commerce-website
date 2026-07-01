import PrivateRoute from "@/components/shared/PrivateRoute";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
