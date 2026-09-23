import { apiSlice } from "@/redux/api/apiSlice";

export type AccountAccess = "FULL" | "APPLICATION_ONLY";
export type AccountApplicationStatus = "SUBMITTED" | "REJECTED" | "APPROVED";

export interface AccountApplicationProfileSnapshot {
  name?: string | null;
  username?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  image?: string | null;
  nidFront?: string | null;
  nidBack?: string | null;
  nidNo?: string | null;
  isDocumentUploaded?: boolean;
}

export interface AccountApplication {
  id: string;
  status: AccountApplicationStatus;
  attemptNumber: number;
  rejectionReason?: string | null;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  canResubmitAt?: string | null;
  canResubmit: boolean;
  profileSnapshot?: AccountApplicationProfileSnapshot | null;
  documentSnapshot?: AccountApplicationProfileSnapshot | null;
}

export interface AccountApplicationStatusData {
  access: AccountAccess;
  application: AccountApplication;
}

interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

const accountApplicationSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyAccountApplication: builder.query<
      ApiResponse<AccountApplicationStatusData>,
      void
    >({
      query: () => ({
        url: "/account-application/me",
        cache: "no-store",
      }),
      providesTags: ["AccountApplication"],
    }),
    resubmitAccountApplication: builder.mutation<
      ApiResponse<AccountApplication>,
      FormData
    >({
      query: (body) => ({
        url: "/account-application/resubmit",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AccountApplication"],
    }),
  }),
});

export const {
  useGetMyAccountApplicationQuery,
  useResubmitAccountApplicationMutation,
} = accountApplicationSlice;
