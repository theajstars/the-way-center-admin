import { Container } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import AccountManagement from "../AccountManagement";
import Application from "../Application";
import Footer from "../Footer";
import Home from "../Home";
import Parents from "../Parents";
import SideNav from "../SideNav";
import Surrogates from "../Surrogates";
import TopNav from "../TopNav";

export default function Dashboard() {
  return (
    <>
      <TopNav />
      <SideNav />
      <Container maxWidth="xl">
        <div className="dashboard-component">
          <Routes>
            <Route path="/" index element={<Home />} />
            <Route path="/parents" index element={<Parents />} />
            <Route path="/surrogates" index element={<Surrogates />} />
            {/* <Route path="/application" index element={<Application />} /> */}
          </Routes>

          {/* <Footer /> */}
        </div>
      </Container>
    </>
  );
}
