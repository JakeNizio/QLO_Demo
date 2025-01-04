import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/login");
  }

  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleClick}>Login</button>
    </div>
  );
}

export default Home;
