import "../styles/Page.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRegisterMutation } from "./authApiSlice";

function Register() {
  const navigate = useNavigate();

  // state variables
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [register, { isLoading }] = useRegisterMutation();

  // handle register form submission
  async function handleRegister(e) {
    e.preventDefault();

    // validate password
    if (password !== confirmpassword) {
      alert("Passwords do not match");
      return;
    }

    // register the user
    try {
      await register({ username, password }).unwrap(); // call the register mutation

      // reset state
      setUsername("");
      setPassword("");
      setConfirmpassword("");

      // redirect to login page
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      // handle error
      alert("Registration failed");
      if (!err?.status) {
        console.error("No server response");
      } else if (err.status === 401) {
        console.error("Invalid username or password");
      } else {
        console.error("Register failed");
      }
    }
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
      {isLoading ? ( // show loading message if the register mutation is in progress
        <p>Loading...</p>
      ) : (
        // show the register form if the register mutation is not in progress
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
