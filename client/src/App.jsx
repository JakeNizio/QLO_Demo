import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import Layout from "./components/Layout";
import Home from "./public/Home";
import Login from "./auth/Login";
import RequireAuth from "./auth/RequireAuth";
import CreateRoutes from "./manager/CreateRoutes";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Unprotected */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />

            {/* Protected */}
            <Route element={<RequireAuth />}>
              <Route path="createroutes" element={<CreateRoutes />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
