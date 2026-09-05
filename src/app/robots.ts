import { SITE_URL } from "@/lib/seo";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/customer-dashboard",
          "/vendor-dashboard",
          "/v-profile",
          "/profile",
          "/checkout",
          "/shopping-cart",
          "/auth",
          "/settings",
          "/messaging",
          "/notification",
          "/wishlist",
          "/coupon",
          "/custom-orders",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
