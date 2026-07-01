import PrivateRoute from "@/components/shared/PrivateRoute";

export default function CouponLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
