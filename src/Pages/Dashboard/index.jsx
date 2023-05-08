import { Container } from "@mui/material";
import { createContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Endpoints } from "../../API/Endpoints";
import { FetchData } from "../../API/FetchData";
import { PerformRequest } from "../../API/PerformRequests";
import AccountManagement from "../AccountManagement";
import Application from "../Application";
import Footer from "../Footer";
import Home from "../Home";
import MegaLoader from "../Megaloader";
import Messages from "../Messages";
import Parents from "../Parents";
import SideNav from "../SideNav";
import Surrogates from "../Surrogates";
import TopNav from "../TopNav";

const initialContext = {
  CountriesList: [],
  Surrogates: [],
  Parents: [],
  Metrics: {
    parent: undefined,
    surrogate: undefined,
    pairing: undefined,
  },
  refetchData: () => {},
};
const DefaultContext = createContext(initialContext);
export default function Dashboard() {
  const [countries, setCountries] = useState([]);
  const [parents, setParents] = useState([]);
  const [surrogates, setSurrogates] = useState([]);
  const [metrics, setMetrics] = useState({
    ...initialContext.Metrics,
    set: false,
  });
  const getCountries = async () => {
    const r = await PerformRequest.GetCountries();
    if (r.data.response_code === 200) {
      setCountries(r.data.data);
    }
  };
  const getSurrogates = async () => {
    const r = await PerformRequest.GetAllSurrogates(false);
    console.log(r);
    if (r.data.response_code === 200) {
      setSurrogates(r.data.data);
    }
  };
  const getParents = async () => {
    const r = await PerformRequest.GetAllParents(false);
    console.log(r);
    if (r.data.response_code === 200) {
      setParents(r.data.data);
    }
  };
  const getMetrics = async () => {
    const r = await PerformRequest.GetMetrics();
    if (r.data.response_code === 200) {
      setMetrics({ ...r.data.data, set: true });
    }
  };

  const FetchAllData = async () => {
    getCountries();
    getSurrogates();
    getParents();
    getMetrics();
  };
  useEffect(() => {
    FetchAllData();
  }, []);
  useEffect(() => {
    console.log({ metrics, parents, surrogates });
  }, [metrics]);
  return (
    <>
      <SideNav />
      {metrics.set ? (
        <>
          <TopNav />
          <DefaultContext.Provider
            value={{
              ...initialContext,
              CountriesList: countries,
              Parents: parents,
              Metrics: metrics,
              Surrogates: surrogates,
              refetchData: FetchAllData,
            }}
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
      ) : (
        <MegaLoader />
      )}
    </>
  );
}
export { DefaultContext };
