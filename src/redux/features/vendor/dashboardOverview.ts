

import { apiSlice } from "@/redux/api/apiSlice";

const dashboardSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({  

    dashboardStatus: builder.query({
      query: (id) => `/vendor/dashboard/stacks`,
      providesTags: [{ type: "Product" }],
    }),

    

  }),
});

export const {
   
   useDashboardStatusQuery,
   
} = dashboardSlice;