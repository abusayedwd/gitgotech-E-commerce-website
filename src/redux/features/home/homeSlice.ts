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

    ///showroom and showroom product api

      getAllShowroom : builder.query({
      query: () => `/showroom/get-all`,
    }),

      getShowroomProduct: builder.query({
      query: ({id, product_category = ""}) => `/showroom/get-showrooms-products/${id}?product_category=${product_category}`,
    }),

      getVendorshowroom: builder.query({
      query: (id) => `/showroom/get-vendor-showrooms/${id}`,
    }),

    //////add product card and wishlist api data

     getwishlistAndCart: builder.query({
      query: () => `/product/customer/save?saveType=${type}&page=${page}&limit=10`
     }),

     addToCartWishList: builder.mutation({
       query: (data) => ({
         url: `/product/customer/save`,
         method: "POST",
         body: data 
       })
     })


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

  ///
  useGetAllShowroomQuery,
  useGetShowroomProductQuery,
  useGetVendorshowroomQuery

  
} = homeSlice;