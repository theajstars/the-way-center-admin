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
function validateBVN(bvn) {
  if (isNaN(parseInt(bvn[0])) || parseInt(bvn[0]) === 0) {
    return false;
  } else {
    if (bvn.length !== 11) {
      return false;
    } else {
      return true;
    }
  }
}
function validateNIN(nin) {
  if (isNaN(parseInt(nin[0])) || parseInt(nin[0]) === 0) {
    return false;
  } else {
    if (nin.length !== 11) {
      return false;
    } else {
      return true;
    }
  }
}
function getFullDate(dateString) {
  var month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const d = new Date(dateString);
  const m = month[d.getMonth()];
  const date = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();

  return `${m} ${date}, ${hour}:${minute}`;
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
export { validateEmail, validateBVN, validateNIN, getFullDate };
