import { useState } from "react";
import Logo from "../../Assets/IMG/Logo.png";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function SideNav() {
  const [currentActiveLink, setCurrentActiveLink] = useState(null);
  const [isSideNavOpen, setSideNavOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
  }, [location]);

  return (
    <>
      <motion.span
        className="toggle-sidenav"
        onClick={() => setSideNavOpen(!isSideNavOpen)}
        initial={false}
        animate={{
          left: isSideNavOpen ? "300px" : "20px",
        }}
      >
        <i className={`fal fa-${isSideNavOpen ? "times" : "bars"}`}></i>
      </motion.span>
      <motion.div
        className="side-nav-container flex-row"
        initial={false}
        animate={{ left: isSideNavOpen ? "0px" : "-500px" }}
      >
        <div className="side-nav flex-column">
          <div className="side-nav-top flex-column">
            <img src={Logo} alt="" className="side-nav-image" />
            <div className="side-nav-links flex-column">
              <span
                className={`side-nav-link cinzel ${
                  currentActiveLink === "Dashboard"
                    ? "side-nav-link-active"
                    : "side-nav-link-inactive"
                }`}
                onClick={() => {
                  navigate("/dashboard");
                  setCurrentActiveLink("Dashboard");
                }}
              >
                Dashboard
              </span>
              <span
                className={`side-nav-link cinzel ${
                  currentActiveLink === "Surrogate"
                    ? "side-nav-link-active"
                    : "side-nav-link-inactive"
                }`}
                onClick={() => {
                  setCurrentActiveLink("Surrogate");
                }}
              >
                My Surrogate
              </span>
              <span
                className={`side-nav-link cinzel ${
                  currentActiveLink === "Application"
                    ? "side-nav-link-active"
                    : "side-nav-link-inactive"
                }`}
                onClick={() => {
                  navigate("/dashboard/application");
                  setCurrentActiveLink("Application");
                }}
              >
                Application
              </span>
              <span
                className={`side-nav-link cinzel ${
                  currentActiveLink === "Message"
                    ? "side-nav-link-active"
                    : "side-nav-link-inactive"
                }`}
                onClick={() => {
                  setCurrentActiveLink("Message");
                }}
              >
                Message(s)
              </span>
              <span
                className={`side-nav-link cinzel ${
                  currentActiveLink === "Profile"
                    ? "side-nav-link-active"
                    : "side-nav-link-inactive"
                }`}
                onClick={() => {
                  setCurrentActiveLink("Profile");
                }}
              >
                My Profile
              </span>
              <span
                className={`side-nav-link cinzel ${
                  currentActiveLink === "News"
                    ? "side-nav-link-active"
                    : "side-nav-link-inactive"
                }`}
                onClick={() => {
                  setCurrentActiveLink("News");
                }}
              >
                News
              </span>
              <span
                className={`side-nav-link cinzel ${
                  currentActiveLink === "Logout"
                    ? "side-nav-link-active"
                    : "side-nav-link-inactive"
                }`}
                onClick={() => {
                  setCurrentActiveLink("Logout");
                }}
              >
                Logout
              </span>
            </div>
          </div>

          <div className="side-nav-bottom flex-column">
            <span className="poppins fw-600">
              The Way Center Admin Dashboard
            </span>
            <small className="poppins">
              &copy; {new Date(Date.now()).getFullYear()} The Way Center. All
              Rights Reserved
            </small>
          </div>
        </div>
      </motion.div>
    </>
  );
}
