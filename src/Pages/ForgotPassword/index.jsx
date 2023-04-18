import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import Logo from "../../Assets/IMG/Logo.png";
import { validateEmail } from "../../App";
import { useToasts } from "react-toast-notifications";

export default function ForgotPassword() {
  const { addToast } = useToasts();
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const SendReset = () => {
    const isEmailValid = validateEmail(email);
    if (!isEmailValid) {
      addToast("Please enter a valid email", { appearance: "error" });
    } else {
      setResetSent(true);
    }
  };
  return (
    <>
      <div className="auth-bg flex-row">
        <div className="auth-container flex-row">
          <form
            action="#"
            className="auth-form reset-form flex-column"
            onSubmit={(e) => {
              e.preventDefault();
              SendReset();
            }}
          >
            <center>
              <img src={Logo} alt="" className="auth-image" />
            </center>
            {!resetSent ? (
              <>
                <center>
                  <Typography variant="h6" className="auth-title">
                    RESET YOUR PASSWORD
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
                <button type="submit" className="auth-btn">
                  RESET PASSWORD
                </button>
              </>
            ) : (
              <>
                <center>
                  <Typography variant="h6" className="auth-title">
                    check your email for the password reset link
                  </Typography>
                </center>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/login");
                  }}
                  className="auth-btn"
                >
                  BACK TO LOGIN PAGE
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
