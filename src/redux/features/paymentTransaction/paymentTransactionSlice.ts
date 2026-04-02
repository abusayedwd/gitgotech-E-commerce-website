import { apiSlice } from "@/redux/api/apiSlice";

const paymetnTransactionSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET Wallet Transactions
    getWalletTransactions: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/auth/wallet`,
        method: "GET",
        params: { page, limit }, // ✅ cleaner than string concat
      }),
    }),

    // ✅ POST Add Money
    addMoney: builder.mutation({
      query: (body) => ({
        url: `/payment/add-money`,
        method: "POST",
        body,
      }),
    }),

    // ✅ POST Store Card Info
    storeCardInfo: builder.mutation({
      query: (body) => ({
        url: `/payment-card/store-card-info`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CardInfo"], // ✅ invalidate card info cache on add
    }),

    // ✅ GET All Card Info
    getAllCardInfo: builder.query({
      query: () => ({
        url: `/payment-card/get-all-card-info`,
        method: "GET",
      }),
      providesTags: ["CardInfo"], // ✅ add tag for cache management
    }),

    // ✅ DELETE Card Info
    deleteCardInfo: builder.mutation({
      query: (cardId) => ({
        url: `/payment-card/delete-card-info`,
        method: "DELETE", // ⚠️ if your backend uses GET, change it
        params: { cardId },
      }),
      invalidatesTags: ["CardInfo"], // ✅ invalidate card info cache on delete
    }),

    // ✅ GET Withdraw List
    getWithdrawList: builder.query({
      query: ({ searchTerm = "", page = 1, limit = 10 }) => ({
        url: `/withdraw`,
        method: "GET",
        params: {
          searchTerm,
          page,
          limit,
        },
      }),
    }),

    // ✅ POST Withdraw Request
    withdrawRequest: builder.mutation({
      query: (body) => ({
        url: `/withdraw/request`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetWalletTransactionsQuery,
  useAddMoneyMutation,
  useDeleteCardInfoMutation,
  useGetAllCardInfoQuery,
  useStoreCardInfoMutation,

  useGetWithdrawListQuery,
  useWithdrawRequestMutation,
} = paymetnTransactionSlice;
