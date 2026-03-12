import { apiSlice } from "@/redux/api/apiSlice";



const homeSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Get products by category
    getProductsByCategory: builder.query({
      query: (category) => `/home/products-by-category/${category}`,
    }),
    
   getProductDetailsforCustomer: builder.query({
     query: (id) => `/product/customer/details/${id}`
   }),
    // Newest products
    getNewestProducts: builder.query({
      query: ({ searchTerm = "", product_category = "" }) =>
        `/home/newest-products?searchTerm=${searchTerm}&product_category=${product_category}`,
    }),

    // Top products
    getTopProducts: builder.query({
      query: ({ searchTerm = "", product_category = "" }) =>
        `/home/top-products?searchTerm=${searchTerm}&product_category=${product_category}`,
    }),

    // Hot deals
    getHotDeals: builder.query({
      query: ({ searchTerm = "", product_category = "" }) =>
        `/home/hot-deals?searchTerm=${searchTerm}&product_category=${product_category}`,
    }),
    topVendors: builder.query({
      query: (searchTerm = "") =>
        `/home/top-vendors?searchTerm=${searchTerm}`,
    }),

    // Home categories
    getHomeCategories: builder.query({
      query: () => `/home/category`,
    }),

  }),
});

export const {
  useGetProductsByCategoryQuery,
  useGetProductDetailsforCustomerQuery,
  useGetNewestProductsQuery,
  useTopVendorsQuery,
  useGetTopProductsQuery,
  useGetHotDealsQuery,
  useGetHomeCategoriesQuery,
} = homeSlice;