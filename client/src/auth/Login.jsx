import "../styles/Page.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLoginMutation } from "./authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";

function Login() {
  const navigate = useNavigate();

  // state variables
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  async function handleLogin(e) {
    e.preventDefault();

    // login the user
    try {
      const userData = await login({ username, password }).unwrap(); // call the login mutation
      dispatch(
        // set the user credentials in the Redux
        setCredentials({
          user: username,
          accessToken: userData.access,
          refreshToken: userData.refresh,
        })
      );

      // reset state
      setUsername("");
      setPassword("");

      // redirect to home page
      navigate("/");
    } catch (err) {
      // handle error
      alert("Login failed");
      if (!err?.status) {
        console.error("No server response");
      } else if (err.status === 401) {
        console.error("Invalid username or password");
      } else {
        console.error("Login failed");
      }
    }
  }

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  return (
    <div className="page-frame">
      <h1>Login</h1>
      <hr />
      {isLoading ? ( // show loading message if the login mutation is in progress
        <p>Loading...</p>
      ) : (
        // show login form if the login mutation is not in progress
        <form className="form" onSubmit={handleLogin}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </form>
      )}
      <Link to={"/register"}>Create an account</Link>
    </div>
  );
}

export default Login;
