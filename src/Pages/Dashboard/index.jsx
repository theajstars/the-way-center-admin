import { Container } from "@mui/material";
import { createContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Endpoints } from "../../API/Endpoints";
import { FetchData } from "../../API/FetchData";
import AccountManagement from "../AccountManagement";
import Application from "../Application";
import Footer from "../Footer";
import Home from "../Home";
import Messages from "../Messages";
import Parents from "../Parents";
import SideNav from "../SideNav";
import Surrogates from "../Surrogates";
import TopNav from "../TopNav";

const initialContext = {
  CountriesList: [],
};
const DefaultContext = createContext(initialContext);
export default function Dashboard() {
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    const FetchCountries = FetchData({
      method: "GET",
      route: Endpoints.GetCountries,
    }).then((res) => {
      if (res.data.response_code === 200) {
        setCountries(res.data.data);
      }
    });
  }, []);
  return (
    <>
      <TopNav />
      <SideNav />
      <DefaultContext.Provider
        value={{ ...initialContext, CountriesList: countries }}
      >
        <Container maxWidth="xl">
          <div className="dashboard-component">
            <Routes>
              <Route path="/" index element={<Home />} />
              <Route path="/parents" index element={<Parents />} />
              <Route path="/surrogates" index element={<Surrogates />} />
              <Route path="/messages" index element={<Messages />} />
              {/* <Route path="/application" index element={<Application />} /> */}
            </Routes>

            {/* <Footer /> */}
          </div>
        </Container>
      </DefaultContext.Provider>
    </>
  );
}
export { DefaultContext };
