import PrivateRoute from "@/components/shared/PrivateRoute";

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
