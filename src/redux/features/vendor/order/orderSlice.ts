import { apiSlice } from "@/redux/api/apiSlice";

const orderSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Get Vendor Orders
    getVendorOrders: builder.query({
      query: ({ page = 1, limit = 10, searchQ = "", filter = "", showroomId }) => ({
        url: `/order/vendor/get?page=${page}&limit=${limit}&searchQ=${searchQ}&filter=${filter}`,
        method: "GET",
        headers: {
          showroom: showroomId,
        },
      }),
      providesTags: ["Orders"],
    }),

    // Get Order Details
    getOrderDetails: builder.query({
      query: ({ id, showroomId }) => ({
        url: `/order/vendor/details/${id}`,
        method: "GET",
        headers: {
          showroom: showroomId,
        },
      }),
      providesTags: ["Orders"],
    }),

    // Update Order Status
    updateOrderStatus: builder.mutation({
      query: ({ id, orderStatus, showroomId }) => ({
        url: `/order/vendor/action/${id}`,
        method: "PATCH",
        headers: {
          showroom: showroomId,
        },
        body: {
          orderStatus,
        },
      }),
      invalidatesTags: ["Orders"],
    }),

    // Get Vendor Return Orders
    getVendorReturns: builder.query({
      query: ({ page = 1, limit = 10, searchQ = "", filter = "", showroomId }) => ({
        url: `/order/vendor/return?searchQ=${searchQ}&page=${page}&limit=${limit}&filter=${filter}`,
        method: "GET",
        headers: {
          showroom: showroomId,
        },
      }),
      providesTags: ["Returns"],
    }),

    // Get Return Order Details
    getReturnDetails: builder.query({
      query: ({ id, showroomId }) => ({
        url: `/order/vendor/return-details/${id}`,
        method: "GET",
        headers: {
          showroom: showroomId,
        },
      }),
      providesTags: ["Returns"],
    }),

    // Return Order Action (accept/decline)
    returnOrderAction: builder.mutation({
      query: ({ id, action, showroomId }) => ({
        url: `/order/vendor/return-action/${id}?action=${action}`,
        method: "PATCH",
        headers: {
          showroom: showroomId,
        },
      }),
      invalidatesTags: ["Returns"],
    }),

  }),
});

export const {
  useGetVendorOrdersQuery,
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
  useGetVendorReturnsQuery,
  useGetReturnDetailsQuery,
  useReturnOrderActionMutation,
} = orderSlice;