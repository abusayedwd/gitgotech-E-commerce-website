import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { notifyTokenExpired } from "@/lib/apiErrorToast";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,

  prepareHeaders: (headers) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return headers;
  },
});

let tokenExpiredHandled = false;

const baseQueryWithTokenExpiry = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (typeof window !== "undefined") {
    const payload = result?.error?.data ?? result?.data;
    const status = result?.error?.status;
    const isExpired =
      payload?.isTokenExpired === true || status === 401;

    if (
      isExpired &&
      !tokenExpiredHandled &&
      !window.location.pathname.startsWith("/auth/login")
    ) {
      tokenExpiredHandled = true;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("authChanged"));
      notifyTokenExpired(
        payload?.message || "Access denied. Token has expired.",
      );
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithTokenExpiry,
  tagTypes: [
    "Profile",
    "SaveItems",
    "CardInfo",
    "Careers",
    "Events",
    "Showroom",
    "Messages",
    "Product",
    "Order",
    "Orders",
    "Returns",
    "CustomOrders",
    "Wallet",
    "Withdraw",
    "Holds",
    "Support",
    "Review",
    "DeliveryRequests",
    "Notifications",
    "Dashboard",
    "Coupons",
    "Settings",
    "BlockedUsers",
    "Reports",
    "Advertisements",
  ],
  endpoints: () => ({}),
});