"use client";

import { usePathname } from "next/navigation";
import FashionSearchNav from "../components/FilterProduct";

const RouteConditionalNav = () => {
  const pathname = usePathname();

  // Define routes where FashionSearchNav should be displayed
  const showFashionSearchNav =
    pathname === "/" ||
    pathname.startsWith("/hotdeals") ||
    pathname.startsWith("/new-arrivals") ||
    pathname.startsWith("/category") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/search");

  if (showFashionSearchNav) {
    return <FashionSearchNav />;
  }

  return null;
};

export default RouteConditionalNav;
