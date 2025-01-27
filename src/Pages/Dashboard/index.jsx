import { createContext, useEffect, useState } from "react";

import { Route, Routes, useNavigate } from "react-router-dom";

import { Container } from "@mui/material";
import { Endpoints } from "../../API/Endpoints";
import { FetchData } from "../../API/FetchData";
import { PerformRequest } from "../../API/PerformRequests";
import AccountManagement from "../AccountManagement";
import Application from "../Application";
import Footer from "../Footer";
import Home from "../Home";
import MegaLoader from "../Megaloader";
import Messages from "../Messages";
import Pairings from "../Pairings";
import ParentProfileView from "../ParentProfileView";
import Parents from "../Parents";
import ParentUpdate from "../ParentUpdate";
import Reports from "../Reports";
import SideNav from "../SideNav";
import SurrogateProfileView from "../SurrogateProfileView";
import Surrogates from "../Surrogates";
import SurrogateUpdate from "../SurrogateUpdate";
import TopNav from "../TopNav";
import Team from "../Team";
import Cookies from "js-cookie";

const initialContext = {
  Notifications: {
    unread: 0,
    requests: 0,
  },
  CountriesList: [],
  Surrogates: [],
  Parents: [],
  Relationships: [],
  Tribes: [],
  Religions: [],
  Profile: {
    token: "",
    lastname: "",
    firstname: "",
    middlename: "",
    email: "",
    phone: "",
    accountCode: "",
    accountConnected: "",
  },
  Metrics: {
    parent: undefined,
    surrogate: undefined,
    pairing: undefined,
  },

  refetchData: () => {},
};
const DefaultContext = createContext(initialContext);

export default function Dashboard() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [parents, setParents] = useState([]);
  const [surrogates, setSurrogates] = useState([]);
  const [profile, setProfile] = useState();

  const [notifications, setNotifications] = useState(
    initialContext.Notifications
  );

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
  const getNotifications = async () => {
    const r = await PerformRequest.GetNotificationCount();
    if (r.data.response_code === 200) {
      setNotifications(r.data.data ?? initialContext.Notifications);
    }
  };
  const getMetrics = async () => {
    const r = await PerformRequest.GetMetrics();
    if (r.data.response_code === 200) {
      setMetrics({ ...r.data.data, set: true });
    }
  };
  const getProfile = async () => {
    const r = await PerformRequest.GetProfile();
    console.log(r);
    if (r.data.status !== "success") {
      Cookies.remove("token");
      navigate("/login");
    } else {
      if (r.data.data.accountConnected === "Parent") {
        navigate("/login");
        Cookies.remove("token");
      }
    }
    setProfile(r.data.data ?? initialContext.Profile);
  };

  const FetchAllData = async () => {
    await getProfile();
    getCountries();
    getSurrogates();
    getParents();
    getMetrics();
    getRelationships();
    getTribes();
    getReligions();
    getNotifications();
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
      {profile ? (
        <>
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
              Profile: profile,
              Notifications: notifications,
            }}
          >
            <TopNav />
            <Container maxWidth="xl">
              <div className="dashboard-component">
                <Routes>
                  <Route path="/" index element={<Home />} />
                  <Route path="/parents" index element={<Parents />} />
                  <Route
                    path="/parent/:parentID"
                    index
                    element={<ParentProfileView />}
                  />
                  <Route
                    path="/parent/update/:parentID"
                    index
                    element={<ParentUpdate />}
                  />
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
                  <Route path="/pairings" index element={<Pairings />} />
                  <Route path="/reports" index element={<Reports />} />
                  <Route path="/team" index element={<Team />} />
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
