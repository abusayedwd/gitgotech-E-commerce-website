import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
  
    baseUrl: "https://beginner-rochester-cartridges-tubes.trycloudflare.com/api/v1", 
    // baseUrl: "http://10.10.7.68:3050/v1", https://beginner-rochester-cartridges-tubes.trycloudflare.com/
    
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      // console.log("9 baseApi", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },

    
  }),
  tagTypes: ["Profile", "Campaign", "Wallet", "Showroom", "About"],  

  endpoints: () => ({}), 
});