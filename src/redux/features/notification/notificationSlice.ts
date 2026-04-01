import { apiSlice } from "@/redux/api/apiSlice";

const nofiticationSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get Notifications
    getNotifications: builder.query({
      query: ({ page = 1, limit = 10, showroomId }) => ({
        url: `/notification/get?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => {
        return response.data;
      },
    }),
  }),
});

export const { useGetNotificationsQuery } = nofiticationSlice;
