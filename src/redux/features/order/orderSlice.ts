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
      providesTags: ["Orders"],
    }),

    // ✅ GET - Customer Return Orders
    getCustomerReturnOrders: builder.query({
      query: ( ) => ({
        url: "/order/customer/return/get",
        method: "GET",
        
        providesTags: ["Orders"],
      }),
    }),

    // ✅ GET - Customer Main Orders (paginated)
    getCustomerMainOrders: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/order/customer/main/get",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["Orders"],
    }),

    getMainOrderDetails: builder.query({
      query: (id) => ({
        url: `/order/vendor/details/${id}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),

    getReturnOrderDetails: builder.query({
      query: (id) => ({
        url: `/order/vendor/return-details/${id}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),

     // ✅ POST - Add Vendor Order
    addVendorOrder: builder.mutation({
      query: (body) => ({
        url: "/order/vendor/add",
        method: "POST",
        body,
      }),
     invalidatesTags: ["Orders"], 
    }),


    // ✅ POST - Add Custom Order
    addCustomOrder: builder.mutation({
      query: (body) => ({
        url: "/order/custom/add",
        method: "POST",
        body,
      }),
     invalidatesTags: ["Orders"],
    }),

    // ✅ POST - Add Return Order (multipart: data JSON + product-N files)
    addReturnOrder: builder.mutation({
      query: ({ orderId, formData }) => ({
        url: `/order/return/add/${orderId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Orders", "Returns"],
    }),

    customOrderPlace: builder.mutation({
      query: ({ id, data }) => ({
        url: `/order/customer/design-request/accept/${id}`, 
        method: "PATCH",
        body:data,
      }),
      invalidatesTags: [{type:"Orders"}],
    }),

    reportCustomerReturn: builder.mutation({
      query: ({ orderId, formData }) => ({
        url: `/order/customer/return/report/${orderId}`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["Orders", "Returns"],
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

  useGetMainOrderDetailsQuery,
  useGetReturnOrderDetailsQuery,
  useCustomOrderPlaceMutation,
  useReportCustomerReturnMutation,
} = orderSlice;