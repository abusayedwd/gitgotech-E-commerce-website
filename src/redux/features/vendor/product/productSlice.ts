import { apiSlice } from "@/redux/api/apiSlice";

const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // GET PRODUCTS
    getProducts: builder.query({
      query: ({ page = 1, limit = 10, showroomId }) => ({
        url: `/product`,
        params: { page, limit },
        headers: {
          showroom: showroomId,
        },
      }),
      providesTags: [{ type: "Product" }],
    }),

    // GET PRODUCT DETAILS
    getProductDetails: builder.query({
      query: (id) => `/product/details/${id}`,
      providesTags: [{ type: "Product" }],
    }),

    // ADD PRODUCT
    addProduct: builder.mutation({
      query: (data) => ({
        url: `/product/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Product" }],
    }),

    // UPDATE PRODUCT
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/product/edit/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [{ type: "Product" }],
    }),

    // DELETE PRODUCT
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Product" }],
    }),

  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productSlice;