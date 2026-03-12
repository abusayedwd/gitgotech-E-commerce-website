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
      query: ({ type = "created", page = 1, limit = 10 }) => 
        `/event/get?type=${type}&page=${page}&limit=${limit}`,
      providesTags: ["Events"],
    }),

  }),
});

export const {
  useCreateEventMutation,
  useGetEventsQuery,
} = eventSlice;