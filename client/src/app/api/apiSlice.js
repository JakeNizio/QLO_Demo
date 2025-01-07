import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { updateAccessToken, logout } from "../../auth/authSlice";

// Define the base query using fetchBaseQuery
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  credentials: "include", // Include credentials in the request
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token; // Get the token from the Redux store
    if (token) {
      // If a token exists, set the Authorization header
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Define a base query function that includes reauthentication
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions); // Call the base query function

  // If the response status is 401, send a refresh token request
  if (result?.error?.status === 401) {
    console.log("sending refresh token");

    const refreshToken = localStorage.getItem("refresh"); // Get the refresh token from local storage

    // Send a refresh token request
    const refreshResult = await baseQuery(
      {
        url: "/api/token/refresh/",
        method: "POST",
        body: { refresh: refreshToken },
      },
      api,
      extraOptions
    );

    // If the refresh token request is successful, update the access token and call the base query function again
    if (refreshResult?.data) {
      api.dispatch(updateAccessToken(refreshResult.data.access));
      result = await baseQuery(args, api, extraOptions);

      // If the refresh token request fails, log out the user
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
}); // Create an API slice
