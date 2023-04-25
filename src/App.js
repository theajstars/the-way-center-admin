import { useEffect } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Cookies from "js-cookie";

import Login from "./Pages/Login";

import "./Assets/CSS/All.css";
import ForgotPassword from "./Pages/ForgotPassword";
import Dashboard from "./Pages/Dashboard";
import Home from "./Pages/Home";
import LandingPage from "./Pages/LandingPage";
import Application from "./Pages/Application";
import Parents from "./Pages/Parents";
import Surrogates from "./Pages/Surrogates";
import Messages from "./Pages/Messages";
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function App() {
  const token = Cookies.get("token");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="/dashboard/parents" element={<Parents />} />
            <Route path="/dashboard/surrogates" element={<Surrogates />} />
            <Route path="/dashboard/application" element={<Application />} />
            <Route path="/dashboard/messages" element={<Messages />} />
          </Route>
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </LocalizationProvider>
  );
}

export default App;
export { validateEmail };
