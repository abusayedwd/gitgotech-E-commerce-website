import { apiSlice } from "@/redux/api/apiSlice";

const settingsSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Get Terms
    getTerms: builder.query({
      query: () => "/terms",
     
    }),

    // Get About
    getAbout: builder.query({
      query: () => "/about",
  
    }),

    // Get Privacy Policy
    getPrivacy: builder.query({
      query: () => "/privacy",
 
    }),

    // Change Password
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),

  }),
});

export const {
  useGetTermsQuery,
  useGetAboutQuery,
  useGetPrivacyQuery,
  useChangePasswordMutation,
} = settingsSlice;