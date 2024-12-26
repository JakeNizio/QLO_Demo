import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken } from "../auth/authSlice";
import { useEffect } from "react";
import { useGetUsersQuery } from "./managersApiSlice";

function CreateRoutes() {
  const { data, isError, error, isLoading, isSuccess } = useGetUsersQuery();

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    content = (
      <ul>
        {data.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    );
  } else if (isError) {
    content = <p>{error}</p>;
  }

  return (
    <div>
      <h1>Create Routes</h1>
      {content}
    </div>
  );
}

export default CreateRoutes;
