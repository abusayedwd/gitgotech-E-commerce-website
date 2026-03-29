import { apiSlice } from "@/redux/api/apiSlice";

 

export const orderSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ GET - Customer Custom Orders
    getCustomerCustomOrders: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/order/customer/custom/get",
        method: "GET",
        params: { page, limit },
      }),
    }),

    // ✅ GET - Customer Return Orders
    getCustomerReturnOrders: builder.query({
      query: ( ) => ({
        url: "/order/customer/return/get",
        method: "GET",
       
      }),
    }),

    // ✅ GET - Customer Main Orders
    getCustomerMainOrders: builder.query({
      query: () => ({
        url: "/order/customer/main/get",
        method: "GET",
      }),
    }),

    // ✅ POST - Add Custom Order
    addCustomOrder: builder.mutation({
      query: (body) => ({
        url: "/order/custom/add",
        method: "POST",
        body,
      }),
    }),

    // ✅ POST - Add Return Order (with ID)
    addReturnOrder: builder.mutation({
      query: ({ id, body }) => ({
        url: `/order/return/add/${id}`,
        method: "POST",
        body,
      }),
    }),

    // ✅ POST - Add Vendor Order
    addVendorOrder: builder.mutation({
      query: (body) => ({
        url: "/order/vendor/add",
        method: "POST",
        body,
      }),
    }),

  }),
});

export const {
  useGetCustomerCustomOrdersQuery,
  useGetCustomerReturnOrdersQuery,
  useGetCustomerMainOrdersQuery,
  useAddCustomOrderMutation,
  useAddReturnOrderMutation,
  useAddVendorOrderMutation,
} = orderSlice;