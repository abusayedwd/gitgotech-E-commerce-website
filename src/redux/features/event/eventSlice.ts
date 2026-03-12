import { apiSlice } from "@/redux/api/apiSlice";

const eventSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Create Event
    createEvent: builder.mutation({
      query: (data) => ({
        url: "/event/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Events"],
    }),

    // Get Events (created / invited)
    getEvents: builder.query({
      query: (type = "created") => `/event/get?type=${type}`,
      providesTags: ["Events"],
    }),

  }),
});

export const {
  useCreateEventMutation,
  useGetEventsQuery,
} = eventSlice;