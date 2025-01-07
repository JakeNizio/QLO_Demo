import { createSlice } from "@reduxjs/toolkit";

// Load initial user and token from local storage
const user = localStorage.getItem("user");
const token = localStorage.getItem("token");

const authSlice = createSlice({
  // Create a Redux slice for authentication state
  name: "auth",
  initialState: {
    user: user || null, // Initialize the user and token from local storage
    token: token || null, // Initialize the user and token from local storage
  },
  reducers: {
    setCredentials: (state, action) => {
      // Define a reducer for setting user credentials
      const { user, accessToken, refreshToken } = action.payload;

      // Set the user and token in the state and local storage
      state.user = user;
      localStorage.setItem("user", user);
      state.token = accessToken;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refresh", refreshToken);
    },
    updateAccessToken: (state, action) => {
      // Define a reducer for updating the access token
      state.token = action.payload;
      // Update the access token in the state and local storage
      localStorage.setItem("token", action.payload);
    },
    logout: (state) => {
      // Define a reducer for logging out

      // Clear the user and token from the state and local storage
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
    },
  },
});

export const { setCredentials, updateAccessToken, logout } = authSlice.actions; // Export the action creators

export default authSlice.reducer; // Export the reducer

export const selectCurrentUser = (state) => state.auth.user; // Export a selector for the current user
export const selectCurrentToken = (state) => state.auth.token; // Export a selector for the current token
