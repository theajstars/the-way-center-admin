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
import Reports from "../Reports";
import SideNav from "../SideNav";
import SurrogateProfileView from "../SurrogateProfileView";
import Surrogates from "../Surrogates";
import SurrogateUpdate from "../SurrogateUpdate";
import TopNav from "../TopNav";

const initialContext = {
  CountriesList: [],
  Surrogates: [],
  Parents: [],
  Relationships: [],
  Tribes: [],
  Religions: [],
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

  const [relationships, setRelationships] = useState([]);
  const [religions, setReligions] = useState([]);
  const [tribes, setTribes] = useState([]);

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
    if (r.data.response_code === 200) {
      setSurrogates(r.data.data);
    }
  };
  const getParents = async () => {
    const r = await PerformRequest.GetAllParents(false);
    if (r.data.response_code === 200) {
      setParents(r.data.data);
    }
  };
  const getRelationships = async () => {
    const r = await PerformRequest.GetRelationships();
    if (r.data.response_code === 200) {
      setRelationships(r.data.data);
    }
  };
  const getTribes = async () => {
    const r = await PerformRequest.GetTribes();
    if (r.data.response_code === 200) {
      setTribes(r.data.data);
    }
  };
  const getReligions = async () => {
    const r = await PerformRequest.GetReligions();
    if (r.data.response_code === 200) {
      setReligions(r.data.data);
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
    getRelationships();
    getTribes();
    getReligions();
  };
  useEffect(() => {
    FetchAllData();
  }, []);
  // useEffect(() => {
  //   console.log({ metrics, parents, surrogates });
  // }, [metrics]);
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
              Relationships: relationships,
              refetchData: FetchAllData,
              Tribes: tribes,
              Religions: religions,
            }}
          >
            <Container maxWidth="xl">
              <div className="dashboard-component">
                <Routes>
                  <Route path="/" index element={<Home />} />
                  <Route path="/parents" index element={<Parents />} />
                  <Route path="/surrogates" index element={<Surrogates />} />
                  <Route
                    path="/surrogate/:surrogateID"
                    index
                    element={<SurrogateProfileView />}
                  />
                  <Route
                    path="/surrogate/update/:surrogateID"
                    index
                    element={<SurrogateUpdate />}
                  />
                  <Route path="/messages" index element={<Messages />} />
                  <Route path="/reports" index element={<Reports />} />
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
