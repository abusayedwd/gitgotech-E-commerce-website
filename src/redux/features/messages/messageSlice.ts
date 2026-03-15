import { apiSlice } from "@/redux/api/apiSlice";

const messageSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Get chat list
    getChatList: builder.query({
      query: () => "/chat/list",
      providesTags: ["Messages"],
    }),

    // Get chat messages
    getChatMessages: builder.query({
      query: (chatId) => `/chat/details/${chatId}`,
      providesTags: (result, error, chatId) => [{ type: "Messages", id: chatId }],
    }),

    // Send message
    sendMessage: builder.mutation({
      query: (data: { receiverId: string; content: string; file?: string }) => ({
        url: `/chat/send/${data.receiverId}`,
        method: "POST",
        body: {
          content: data.content,
          file: data.file,
        },
      }),
      invalidatesTags: ["Messages"],
    }),

    // Send message via socket
    sendMessageSocket: builder.mutation({
      queryFn: (data: { receiverId: string; content: string; file?: string }) => {
        // This will be handled by socket
        return { data: data };
      },
    }),

  }),
});

export const {
  useGetChatListQuery,
  useGetChatMessagesQuery,
  useSendMessageMutation,
  useSendMessageSocketMutation,
} = messageSlice;