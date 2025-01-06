import "../styles/Page.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLoginMutation } from "./authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  async function handleRegister(e) {
    e.preventDefault();

    if (password !== confirmpassword) {
      alert("Passwords do not match");
      return;
    }

    // try {
    //   const userData = await login({ username, password }).unwrap();
    //   dispatch(
    //     setCredentials({
    //       user: username,
    //       accessToken: userData.access,
    //       refreshToken: userData.refresh,
    //     })
    //   );
    //   setUsername("");
    //   setPassword("");
    //   navigate("/");
    // } catch (err) {
    //   console.log(err);
    //   if (!err?.status) {
    //     console.error("No server response");
    //   } else if (err.status === 401) {
    //     console.error("Invalid username or password");
    //   } else {
    //     console.error("Register failed");
    //   }
    // }
  }

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleConfirmpasswordChange(e) {
    setConfirmpassword(e.target.value);
  }

  return (
    <div className="page-frame">
      <h1>Register</h1>
      <hr />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form className="form" onSubmit={handleRegister}>
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
          <label htmlFor="confirmpassword">Confirm Password</label>
          <input
            type="password"
            id="confirmpassword"
            value={confirmpassword}
            onChange={handleConfirmpasswordChange}
            required
          />
          <button className="btn btn-primary" type="submit">
            Register
          </button>
        </form>
      )}
    </div>
  );
}

export default Register;
