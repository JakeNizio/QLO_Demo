import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <p>layout</p>
      <Outlet />
    </>
  );
}

export default Layout;
