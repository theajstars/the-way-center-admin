import { useState } from "react";
import Logo from "../../Assets/IMG/Logo.png";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { RouteList } from "../../Lib/Routes";
export default function SideNav() {
  const [currentActiveLink, setCurrentActiveLink] = useState(null);
  const [isSideNavOpen, setSideNavOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;
    console.log(pathname);
    if (pathname === "/dashboard") {
      setCurrentActiveLink("dashboard");
    } else {
      const path = pathname.replace("/dashboard", "");
      const lastIndex = path.lastIndexOf("/");
      console.clear();
      if (lastIndex !== -1 && lastIndex !== 0) {
        const subPathString = path.substring(0, lastIndex);
        console.log(subPathString);
      } else {
        console.log(path);
        setCurrentActiveLink(path.replace("/", "").toLowerCase());
      }
    }
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
              {RouteList.map((route, index) => {
                return (
                  <Link
                    className={`side-nav-link cinzel ${
                      currentActiveLink === route.title.toLowerCase()
                        ? "side-nav-link-active"
                        : "side-nav-link-inactive"
                    }`}
                    onClick={() => setSideNavOpen(false)}
                    to={route.path}
                  >
                    {route.title}
                  </Link>
                );
              })}

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
