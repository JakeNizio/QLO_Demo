import { apiSlice } from "../app/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  // Inject the manager endpoints for the api slice
  endpoints: (builder) => ({
    geocodeAddress: builder.mutation({
      query: (data) => ({
        // Define the query for the geocodeAddress mutation
        url: "/api/geocodeaddress/",
        method: "POST",
        body: data,
      }),
    }),
    optimizeRoutes: builder.mutation({
      // Define the query for the optimizeRoutes mutation
      query: (data) => ({
        url: "/api/optimizeroutes/",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useOptimizeRoutesMutation, useGeocodeAddressMutation } =
  usersApiSlice; // Export the hooks for the optimizeRoutes and geocodeAddress mutations
