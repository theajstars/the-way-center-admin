import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import Logo from "../../Assets/IMG/Logo.png";
import { validateEmail } from "../../App";
import { useToasts } from "react-toast-notifications";
import Cookies from "js-cookie";

export default function Login() {
  const { addToast } = useToasts();
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const LoginUser = () => {
    const isEmailValid = validateEmail(email);
    if (!isEmailValid) {
      addToast("Please enter a valid email", { appearance: "error" });
    } else {
      if (password.length < 6) {
        addToast("Password must be at least 6 characters", {
          appearance: "error",
        });
      } else {
        addToast("Login successful", { appearance: "success" });
        Cookies.set("token", "some_token_string");
        navigate("/dashboard");
      }
    }
  };
  return (
    <>
      <div className="auth-bg flex-row">
        <div className="auth-container flex-row">
          <form
            action="#"
            className="auth-form login-form flex-column"
            onSubmit={(e) => {
              e.preventDefault();
              LoginUser();
            }}
          >
            <center>
              <img src={Logo} alt="" className="auth-image" />
            </center>
            <center>
              <Typography variant="h6" className="auth-title">
                sign in to your dashboard
              </Typography>
            </center>

            <div className="default-input-container flex-column">
              <label htmlFor="email" className="default-input-label">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                id="email"
                className="default-input"
              />
            </div>
            <div className="default-input-container flex-column">
              <label htmlFor="password" className="default-input-label">
                Password
              </label>
              <div className="default-input-with-addon-container flex-row">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  className="default-input-with-addon"
                />
                <span
                  className="default-input-addon"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <i
                    className={`far fa-${
                      isPasswordVisible ? "eye-slash" : "eye"
                    }`}
                  />
                </span>
              </div>
            </div>
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Link to="/forgot-password" className="mulish gray-text">
                Forgot Password?
              </Link>
            </div>
            <button type="submit" className="auth-btn">
              SIGN IN
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
