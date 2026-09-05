import { apiSlice } from "@/redux/api/apiSlice";

export const advertisementSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdvertisements: builder.query({
      query: ({
        section = "",
        page = 1,
        limit = 10,
        fields = "",
      }: {
        section?: string;
        page?: number;
        limit?: number;
        fields?: string;
      }) => {
        const params = new URLSearchParams();
        if (section) params.set("section", section);
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (fields) params.set("fields", fields);
        return `/advertisement?${params.toString()}`;
      },
      providesTags: ["Advertisements"],
    }),

    getAdvertisementDetails: builder.query({
      query: (advertisementId: string) => `/advertisement/${advertisementId}`,
      providesTags: ["Advertisements"],
    }),
  }),
});

export const {
  useGetAdvertisementsQuery,
  useGetAdvertisementDetailsQuery,
} = advertisementSlice;
