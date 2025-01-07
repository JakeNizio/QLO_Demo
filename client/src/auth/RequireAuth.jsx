import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";

function RequireAuth() {
  const token = useSelector(selectCurrentToken); // Get the current token from the Redux store
  const location = useLocation();

  return (
    <>
      {token ? ( // If the user is logged in, render the child routes
        <Outlet />
      ) : (
        // Otherwise, redirect to the login page
        <Navigate to="/login" state={{ from: location }} replace /> // Pass the current location to the login page
      )}
    </>
  );
}

export default RequireAuth;
