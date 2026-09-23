import { apiSlice } from "@/redux/api/apiSlice";

export type ShowroomApplicationStatus = "SUBMITTED" | "APPROVED" | "REJECTED";

export interface ShowroomApplication {
    id: string;
    status: ShowroomApplicationStatus;
    attemptNumber: number;
    rejectionReason?: string | null;
    submittedAt?: string | null;
    reviewedAt?: string | null;
    canResubmit: boolean;
    canResubmitAt?: string | null;
}

const showroomSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getShowroom:builder.query({
            query: () => `/showroom/get`,
            providesTags: [{type: "Showroom"}]
        }),
        getShowroomDetails:builder.query({
            query: (id) => `/showroom/details/${id}`,
            providesTags: [{type: "Showroom"}]
        }),
        getVendorShowrooms:builder.query({
            query: (vendorId) => `/showroom/get-vendor-showrooms/${vendorId}`,
            providesTags: [{type: "Showroom"}]
        }),
        getShowroomByVendor: builder.query({
            query: () => `/showroom/get`,
            providesTags: [{type: "Showroom"}]
        }),

        addShowroom: builder.mutation({
            query: (data) => ({
                url: `/showroom/add`,
                method:"POST",
                body: data,
            }),
            invalidatesTags: [{type: "Showroom"}]
        }),

        updateShowroom: builder.mutation({
            query: ({data, id}) => ({
                url: `/showroom/update/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: [{type: "Showroom"}]
        }),

        resubmitShowroom: builder.mutation({
            query: ({data, id}: {data: FormData; id: string}) => ({
                url: `/showroom/resubmit/${id}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{type: "Showroom"}]
        }),

        deleteShowroom: builder.mutation({
            query: (id) => ({
                url: `/showroom/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{type: "Showroom"}]
        }),




    })
})

export const {
    useAddShowroomMutation,
    useGetShowroomDetailsQuery,
    useGetShowroomQuery,
    useGetVendorShowroomsQuery,
    useUpdateShowroomMutation,
    useResubmitShowroomMutation,
    useDeleteShowroomMutation,
    useGetShowroomByVendorQuery

} = showroomSlice;
