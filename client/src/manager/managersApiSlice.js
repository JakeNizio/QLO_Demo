import { apiSlice } from "../app/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/api/users/",
    }),
  }),
});

export const { useGetUsersQuery } = usersApiSlice;
