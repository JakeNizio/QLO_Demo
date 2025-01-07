import "../styles/Page.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";

function Home() {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser); // Get the current user from the Redux store

  function handleCreateRoutesClick() {
    navigate("/createroutes");
  }

  return (
    <div className="page-frame">
      <h1>Home</h1>
      <hr />
      {user ? ( // Conditional rendering based on whether the user is logged in
        <>
          <h3>{'Click on the "Create Routes" button to get started.'}</h3>
          <button className="btn btn-primary" onClick={handleCreateRoutesClick}>
            Create Routes
          </button>
        </>
      ) : (
        <h3>
          Welcome to the QLO Demo! Please <Link to={"/login"}>login</Link> to
          access the application.
        </h3>
      )}
    </div>
  );
}

export default Home;
