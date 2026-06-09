import { apiSlice } from "@/redux/api/apiSlice";

const buildTicketFormData = ({
  title,
  description,
  attachments,
}: {
  title: string;
  description: string;
  attachments?: File[];
}) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  attachments?.forEach((file) => formData.append("attachments", file));
  return formData;
};

const buildMessageFormData = ({
  content,
  attachments,
}: {
  content: string;
  attachments?: File[];
}) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify({ content }));
  attachments?.forEach((file) => formData.append("attachments", file));
  return formData;
};

const supportMessageSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create Support Ticket
    initSupport: builder.mutation({
      query: (body: {
        title: string;
        description: string;
        attachments?: File[];
      }) => ({
        url: `/tickets`,
        method: "POST",
        body: buildTicketFormData(body),
      }),
      invalidatesTags: ["Support"],
    }),

    // Get my active ticket (single)
    getSupportList: builder.query({
      query: () => ({
        url: `/tickets/my`,
        method: "GET",
      }),
      providesTags: ["Support"],
    }),

    // Get messages of a ticket (paginated)
    getSupportMessages: builder.query({
      query: ({
        ticketId,
        page = 1,
        limit = 20,
      }: {
        ticketId: string;
        page?: number;
        limit?: number;
      }) => ({
        url: `/tickets/${ticketId}/messages?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Support"],
    }),

    // Send message in a ticket
    sendSupportMessage: builder.mutation({
      query: ({
        ticketId,
        content,
        attachments,
      }: {
        ticketId: string;
        content: string;
        attachments?: File[];
      }) => ({
        url: `/tickets/${ticketId}/message`,
        method: "POST",
        body: buildMessageFormData({ content, attachments }),
      }),
      invalidatesTags: ["Support"],
    }),
  }),
});

export const {
  useInitSupportMutation,
  useGetSupportListQuery,
  useSendSupportMessageMutation,
  useGetSupportMessagesQuery,
} = supportMessageSlice;
