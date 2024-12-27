import { apiSlice } from "../app/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    geocodeAddress: builder.mutation({
      query: (data) => ({
        url: "/api/geocodeaddress/",
        method: "POST",
        body: data,
      }),
    }),
    optimizeRoutes: builder.mutation({
      query: (data) => ({
        url: "/api/optimizeroutes/",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useOptimizeRoutesMutation, useGeocodeAddressMutation } =
  usersApiSlice;
