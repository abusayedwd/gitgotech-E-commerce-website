import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
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
  }),
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
    "Support",
    "Review",
    "DeliveryRequests",
    "Notifications",
    "Dashboard",
    "Coupons"
  ],
  endpoints: () => ({}),
});