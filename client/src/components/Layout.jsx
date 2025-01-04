import "../styles/Layout.css";
import "../styles/Page.css";

import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="layout">
      <div className="layout-header">
        <div>
          <h1>QLO Demo</h1>
          <button className="btn btn-light">Login</button>
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
