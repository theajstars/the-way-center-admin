import { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";

import { Typography } from "@mui/material";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  ChakraProvider,
  Text,
} from "@chakra-ui/react";
import DashboardOverview from "../DashboardOverview";
import {
  initialSurrogate,
  RecentParents as RecentSurrogates,
} from "../../Assets/Data";
import SurrogateProfileView from "../SurrogateProfileView";
import CreatePairing from "../CreatePairing";
import { DefaultContext } from "../Dashboard";
import { PerformRequest } from "../../API/PerformRequests";

export default function Surrogates() {
  const navigate = useNavigate();
  const ContextConsumer = useContext(DefaultContext);
  console.log(ContextConsumer);
  const [surrogates, setSurrogates] = useState(RecentSurrogates);
  const [currentSurrogate, setCurrentSurrogate] = useState(initialSurrogate);

  const [isViewSurrogate, setViewSurrogate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const showViewSurrogateModal = (value) => {
    setViewSurrogate(value);
  };

  const [isAddNewPairing, setAddNewPairing] = useState(false);
  const showCreatePairingModal = (value) => {
    setAddNewPairing(value);
  };
  const [recentSurrogates, setRecentSurrogates] = useState(
    ContextConsumer.Surrogates ?? []
  );
  const [recentPairedSurrogates, setRecentPairedSurrogates] = useState(
    ContextConsumer.Surrogates ?? []
  );
  const [recentUnPairedSurrogates, setRecentUnPairedSurrogates] = useState(
    ContextConsumer.Surrogates ?? []
  );

  const getRecentSurrogates = async () => {
    const r = await PerformRequest.GetAllSurrogates({
      orderBy: "new",
    });
    console.log(r);
    if (r.data.response_code === 200) {
      setRecentSurrogates(r.data.data ?? []);
    }
  };
  const getRecentPairedSurrogates = async () => {
    const r = await PerformRequest.GetAllSurrogates({
      orderBy: "new",
      isPaired: "Yes",
    });
    console.log(r);
    if (r.data.response_code === 200) {
      setRecentPairedSurrogates(r.data.data ?? []);
    }
  };
  const getRecentUnPairedSurrogates = async () => {
    const r = await PerformRequest.GetAllSurrogates({
      orderBy: "new",
      isPaired: "No",
    });
    console.log(r);
    if (r.data.response_code === 200) {
      setRecentUnPairedSurrogates(r.data.data ?? []);
    }
  };

  return (
    <div className="home-page">
      {isAddNewPairing && (
        <CreatePairing showCreatePairingModal={showCreatePairingModal} />
      )}
      {isViewSurrogate && (
        <SurrogateProfileView
          showViewSurrogateModal={showViewSurrogateModal}
          surrogate={currentSurrogate}
        />
      )}
      <Typography className="poppins fw-500" variant="h5">
        ADMIN DASHBOARD
      </Typography>
      <br />
      <br />
      <div className="home-container flex-row">
        <div className="home-container-right flex-column">
          <DashboardOverview />
          <span className="px-20 fw-600 poppins uppercase">
            Recent Surrogate(s)
          </span>
          <ChakraProvider>
            <TableContainer className="recent-table-container table-purple">
              <Table variant="simple" colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th className="cinzel uppercase">surrogate name</Th>
                    <Th className="cinzel uppercase">surrogate email</Th>
                    <Th className="cinzel uppercase">action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {ContextConsumer.Surrogates.map((surrogate, index) => {
                    return (
                      <Tr
                        className="fw-600 poppins recent-table-row table-purple-row "
                        key={surrogate.primary.email}
                      >
                        <Td>
                          {index + 1}. &nbsp;{" "}
                          <span className="capitalize">
                            {surrogate.primary.firstname}&nbsp;
                            {surrogate.primary.lastname}
                          </span>
                        </Td>
                        <Td>{surrogate.primary.email}</Td>
                        <Td className="flex-row align-center recent-table-actions">
                          <span
                            className="flex-row recent-table-action align-center"
                            onClick={() => {
                              showViewSurrogateModal(true);
                              setCurrentSurrogate(surrogate);
                            }}
                          >
                            <i className="far fa-pencil-alt" /> &nbsp; Edit
                          </span>
                          <span
                            className="flex-row recent-table-action align-center"
                            onClick={() => {
                              showViewSurrogateModal(true);
                              setCurrentSurrogate(surrogate);
                            }}
                          >
                            <i className="far fa-eye" /> &nbsp; View
                          </span>
                          <span className="flex-row recent-table-action align-center">
                            {surrogate.status ? "Deactivate" : "Activate"}
                          </span>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
              <br />
              <br />
              <div className="flex-row width-100 align-center justify-end">
                <Text
                  className="poppins underline px-14 fw-500 pointer"
                  onClick={() => {
                    navigate("/dashboard/surrogates");
                  }}
                >
                  View All Surrogates
                </Text>
              </div>
            </TableContainer>
            <br />

            <div className="flex-row space-between small-tables-row">
              <TableContainer className="recent-table-container-small table-white">
                <Text className="cinzel px-15 uppercase">
                  recent paired surrogates
                </Text>
                <br />
                <Table variant="simple" colorScheme="whiteAlpha">
                  <Tbody>
                    {recentPairedSurrogates.map((surrogate, index) => {
                      return (
                        <Tr
                          className="fw-600 poppins recent-table-row table-small-row  table-white-row"
                          key={surrogate.primary.email}
                        >
                          <Td>
                            {index + 1}. &nbsp; {surrogate.primary.firstname}
                            &nbsp;
                            {surrogate.primary.lastname}
                          </Td>
                          <Td>{surrogate.email}</Td>
                          <Td className="flex-row align-center recent-table-actions table-small-actions">
                            <span
                              className="flex-row recent-table-action table-small-action align-center"
                              onClick={() => {
                                showViewSurrogateModal(true);
                                setCurrentSurrogate(surrogate);
                              }}
                            >
                              <i className="far fa-pencil-alt" /> &nbsp; Edit
                            </span>
                            <span
                              className="flex-row recent-table-action table-small-action align-center"
                              onClick={() => {
                                showViewSurrogateModal(true);
                                setCurrentSurrogate(surrogate);
                              }}
                            >
                              <i className="far fa-eye" /> &nbsp; View
                            </span>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
                <br />
                <br />
                <div className="flex-row width-100 align-center justify-end">
                  <Text className="poppins underline px-14 fw-500 pointer">
                    View All Paired Surrogates
                  </Text>
                </div>
              </TableContainer>
              <TableContainer className="recent-table-container-small table-white">
                <Text className="cinzel px-15 uppercase">
                  unpaired surrogates
                </Text>
                <br />
                <Table variant="simple" colorScheme="whiteAlpha">
                  <Tbody>
                    {recentUnPairedSurrogates.map((surrogate, index) => {
                      return (
                        <Tr
                          className="fw-600 poppins recent-table-row table-small-row table-white-row "
                          key={surrogate.primary.email}
                        >
                          <Td>
                            {index + 1}. &nbsp; {surrogate.primary.firstname}
                            &nbsp;
                            {surrogate.primary.lastname}
                          </Td>
                          <Td>{surrogate.primary.email}</Td>
                          <Td className="flex-row align-center recent-table-actions table-small-actions">
                            <span
                              className="flex-row recent-table-action table-small-action align-center"
                              onClick={() => {
                                showViewSurrogateModal(true);
                                setCurrentSurrogate(surrogate);
                              }}
                            >
                              <i className="far fa-pencil-alt" /> &nbsp; Edit
                            </span>{" "}
                            &nbsp; &nbsp; &nbsp; &nbsp;
                            <span
                              className="flex-row recent-table-action table-small-action align-center"
                              onClick={() => {
                                showViewSurrogateModal(true);
                                setCurrentSurrogate(surrogate);
                              }}
                            >
                              <i className="far fa-eye" /> &nbsp; View
                            </span>
                            <span
                              className="flex-row recent-table-action table-small-action align-center"
                              onClick={() => {
                                setAddNewPairing(true);
                              }}
                            >
                              <i className="far fa-eye" /> &nbsp; Pair
                            </span>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
                <br />
                <br />
                <div className="flex-row width-100 align-center justify-end">
                  <Text
                    className="poppins underline px-14 fw-500 pointer"
                    onClick={() => {
                      navigate("/dashboard/surrogates");
                    }}
                  >
                    View All Surrogates
                  </Text>
                </div>
              </TableContainer>
            </div>
          </ChakraProvider>
        </div>
      </div>
    </div>
  );
}
