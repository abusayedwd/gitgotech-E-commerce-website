

import { apiSlice } from "@/redux/api/apiSlice";

const reviewSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ GET Product Reviews
    getProductReviews: builder.query({
      query: ({ id, page = 1, limit = 10 }) => ({
        url: `/product/customer/reviews/${id}`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["Review"],
    }),

    // ✅ POST Add Review
    addProductReview: builder.mutation({
      query: ({ id, body }) => ({
        url: `/review/add/${id}`,
        method: "POST",
        body,
        
      }),
      invalidatesTags: ["Review"],
    }),

  }),
});

export const {
  useGetProductReviewsQuery,
  useAddProductReviewMutation,
} = reviewSlice;