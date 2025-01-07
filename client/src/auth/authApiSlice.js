import { apiSlice } from "../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  // Inject the authentication endpoints for the api slice
  endpoints: (builder) => ({
    login: builder.mutation({
      // Define the login mutation
      query: (credentials) => ({
        url: "/api/token/",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      // Define the register mutation
      query: (credentials) => ({
        url: "/api/user/register/",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApiSlice; // Export the hooks for the login and register mutations
