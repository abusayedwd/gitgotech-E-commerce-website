import { apiSlice } from "@/redux/api/apiSlice";

const messageSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getChatList: builder.query({
      query: () => "/chat/list",
      providesTags: ["Messages"],
    }),

    getChatMessages: builder.query({
      query: ( selectedChatId ) => `/chat/details/${selectedChatId}`,
      providesTags: (result, error, { chatId }) => [{ type: "Messages", id: chatId }],
    }),

    sendMessage: builder.mutation({
      query: ({ receiverId, formData }) => ({
        url: `/chat/send/${receiverId}`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["Messages"],
    }),

    getBlockedList: builder.query({
      query: ({ page = 1, limit = 20, searchTerm = "" }) => ({
        url: "/block/my-list",
        params: {
          page,
          limit,
          ...(searchTerm ? { searchTerm } : {}),
        },
      }),
      providesTags: ["BlockedUsers"],
    }),

    blockUser: builder.mutation({
      query: ({ userId, reason }) => ({
        url: `/block/${userId}`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["BlockedUsers", "Messages"],
    }),

    unblockUser: builder.mutation({
      query: (userId) => ({
        url: `/block/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BlockedUsers", "Messages"],
    }),

  }),
});

export const {
  useGetChatListQuery,
  useGetChatMessagesQuery,
  useSendMessageMutation,
  useGetBlockedListQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
} = messageSlice;