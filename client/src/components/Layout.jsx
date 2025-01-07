import "../styles/Layout.css";
import "../styles/Page.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectCurrentUser } from "../auth/authSlice";

function Layout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser); // Get the current user from the Redux store

  function handleHomeClick() {
    navigate("/");
  }

  function handleLoginClick() {
    navigate("/login");
  }

  function handleLogoutClick() {
    dispatch(logout());
    navigate("/");
  }

  return (
    <div className="layout">
      <div className="layout-header">
        <div>
          <h1 onClick={handleHomeClick}>QLO Demo</h1>
          {user ? ( // If the user is logged in, show the Logout button; otherwise, show the Login button
            <button className="btn btn-light" onClick={handleLogoutClick}>
              Logout
            </button>
          ) : (
            <button className="btn btn-light" onClick={handleLoginClick}>
              Login
            </button>
          )}
        </div>
      </div>
      <div className="layout-container">
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
