import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLoginMutation } from "./authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  async function handleLogin(e) {
    e.preventDefault();
    console.log(e.target.username.value);
    console.log(e.target.password.value);

    try {
      const userData = await login({ username, password }).unwrap();
      console.log(userData);
      dispatch(
        setCredentials({
          user: username,
          accessToken: userData.access,
          refreshToken: userData.refresh,
        })
      );
      setUsername("");
      setPassword("");
      navigate("/createroutes");
    } catch (err) {
      console.log(err);
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
    <div>
      <h1>Login</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
}

export default Login;
