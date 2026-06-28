import { apiSlice } from "@/redux/api/apiSlice";

const settingsSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Get Terms
    getTerms: builder.query({
      query: () => ({
        url: `/setting/terms-conditions`,
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),

    // Get About
    getAboutUs: builder.query({
      query: () => ({
        url: `/setting/about-us`,
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),

    // Get Privacy Policy
    getPrivacy: builder.query({
      query: () => ({
        url: `/setting/privacy-policy`,
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),


    platformFree: builder.query({
      query: () => ({
        url: "/platform-setting",
        method: "GET",
      }),
      providesTags: ["Settings"],
     }),

    // Change Password
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),

    getMyProfile: builder.query({
      query: () => "/auth/my-profile",
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/auth/profile-update",    
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),



  }),
});

export const {
  useGetTermsQuery,
  useGetAboutUsQuery,
  useGetPrivacyQuery,
  useChangePasswordMutation,
  useGetMyProfileQuery,
  useUpdateProfileMutation,

  usePlatformFreeQuery,
} = settingsSlice;