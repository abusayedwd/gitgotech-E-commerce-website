import { apiSlice } from "@/redux/api/apiSlice";

export type ReportTargetType = "USER" | "VENDOR" | "SHOWROOM" | "PRODUCT";

export interface SubmitReportPayload {
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  description?: string;
}

const reportSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitReport: builder.mutation({
      query: (body: SubmitReportPayload) => ({
        url: "/report",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reports"],
    }),

    getMyReports: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/report/my",
        params: { page, limit },
      }),
      providesTags: ["Reports"],
    }),

    getMyReportById: builder.query({
      query: (id: string) => `/report/my/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Reports", id }],
    }),

    getReportsOnMyEntities: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/report/on-my-entities",
        params: { page, limit },
      }),
      providesTags: ["Reports"],
    }),
  }),
});

export const {
  useSubmitReportMutation,
  useGetMyReportsQuery,
  useGetMyReportByIdQuery,
  useGetReportsOnMyEntitiesQuery,
} = reportSlice;
