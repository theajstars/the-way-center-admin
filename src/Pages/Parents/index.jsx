import { useState, useEffect, useContext } from "react";

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
import { useToasts } from "react-toast-notifications";

import DashboardOverview from "../DashboardOverview";
import {
  initialParent,
  initialSurrogate,
  RecentParents,
} from "../../Assets/Data";
import ParentProfileView from "../ParentProfileView";
import CreatePairing from "../CreatePairing";
import { DefaultContext } from "../Dashboard";
import { PerformRequest } from "../../API/PerformRequests";
export default function Parents() {
  const ConsumerContext = useContext(DefaultContext);
  const navigate = useNavigate();
  const { addToast, removeAllToasts } = useToasts();

  const [parents, setParents] = useState(RecentParents);
  const [pairedParents, setPairedParents] = useState([]);
  const [unPairedParents, setUnPairedParents] = useState([]);
  const [isViewParent, setViewParent] = useState(false);
  const [parent, setCurrentParent] = useState(initialParent);
  const [surrogate, setCurrentSurrogate] = useState(initialSurrogate);

  const showViewParentModal = (value) => {
    setViewParent(value);
  };
  const [isAddNewPairing, setAddNewPairing] = useState(false);
  const showCreatePairingModal = (value) => {
    setAddNewPairing(value);
  };

  const getPairedParents = async () => {
    const r = await PerformRequest.GetAllParents({
      isPaired: "Yes",
      orderBy: "new",
    });
    console.log(r);
    if (r.data.response_code === 200) {
      setPairedParents(r.data.data ?? []);
    }
  };
  const getUnPairedParents = async () => {
    const r = await PerformRequest.GetAllParents({
      isPaired: "No",
      orderBy: "new",
    });
    console.log(r);
    if (r.data.response_code === 200) {
      setUnPairedParents(r.data.data ?? []);
    }
  };
  useEffect(() => {
    getPairedParents();
    getUnPairedParents();
  }, []);
  const [isParentStatusToggling, setParentStatusToggling] = useState(false);
  const ActivateParent = async (thisParent) => {
    removeAllToasts();
    setParentStatusToggling(true);
    const activate = await PerformRequest.UpdateParent({
      ...thisParent,
      parentID: thisParent.id,
      status: "active",
    });
    setParentStatusToggling(false);
    if (activate.data.response_code === 200) {
      addToast("Parent activated!", { appearance: "success" });
      ConsumerContext.refetchData();
    }
  };
  const DeactivateParent = async (thisParent) => {
    removeAllToasts();
    setParentStatusToggling(true);
    const deactivate = await PerformRequest.UpdateParent({
      ...thisParent,
      parentID: thisParent.id,
      status: "inactive",
    });
    setParentStatusToggling(false);
    if (deactivate.data.response_code === 200) {
      addToast("Parent Deactivated!", { appearance: "success" });
      ConsumerContext.refetchData();
    }
  };
  return (
    <div className="home-page">
      <Typography className="poppins fw-500" variant="h5">
        ADMIN DASHBOARD
      </Typography>
      <br />
      <br />
      <div className="home-container flex-row">
        <div className="home-container-right flex-column">
          <DashboardOverview />
          <span className="px-20 fw-600 poppins uppercase">
            Recent Parent(s)
          </span>
          {isViewParent && (
            <ParentProfileView
              showViewParentModal={showViewParentModal}
              parent={parent}
            />
          )}
          {isAddNewPairing && (
            <CreatePairing showCreatePairingModal={showCreatePairingModal} />
          )}
          <ChakraProvider>
            <TableContainer className="recent-table-container table-purple">
              <Table variant="simple" colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th className="cinzel uppercase">parent name</Th>
                    <Th className="cinzel uppercase">parent email</Th>
                    <Th className="cinzel uppercase">action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {ConsumerContext.Parents.map((parent, index) => {
                    return (
                      <Tr
                        className="fw-600 poppins recent-table-row table-purple-row "
                        key={parent.primary.email}
                      >
                        <Td>
                          {index + 1}. &nbsp;{" "}
                          <span className="uppercase">
                            {parent.primary.firstname} {parent.primary.lastname}
                          </span>
                        </Td>
                        <Td>{parent.primary.email}</Td>
                        <Td className="flex-row align-center recent-table-actions">
                          <span
                            className="flex-row recent-table-action align-center"
                            onClick={() => {
                              showViewParentModal(true);
                              setCurrentParent(parent);
                            }}
                          >
                            <i className="far fa-pencil-alt" /> &nbsp; Edit
                          </span>
                          <span
                            className="flex-row recent-table-action align-center"
                            onClick={() => {
                              showViewParentModal(true);
                              setCurrentParent(parent);
                            }}
                          >
                            <i className="far fa-eye" /> &nbsp; View
                          </span>
                          <span
                            className="flex-row recent-table-action align-center"
                            onClick={() => {
                              parent.status === "active"
                                ? DeactivateParent(parent)
                                : ActivateParent(parent);
                            }}
                          >
                            {parent.status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </span>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
              <br />
              <br />
              {/* <div className="flex-row width-100 align-center justify-end">
                <Text className="poppins underline px-14 fw-500 pointer">
                  View All Parents
                </Text>
              </div> */}
            </TableContainer>
            <br />

            <div className="flex-row space-between small-tables-row">
              <TableContainer className="recent-table-container-small table-white">
                <Text className="cinzel px-15 uppercase">
                  recent paired parents
                </Text>
                <br />
                <Table variant="simple" colorScheme="whiteAlpha">
                  <Tbody>
                    {pairedParents.length === 0 && (
                      <center>
                        <Text className="poppins fw-500">
                          No paired parents
                        </Text>
                      </center>
                    )}
                    {pairedParents.map((parent, index) => {
                      return (
                        <Tr
                          className="fw-600 poppins recent-table-row table-small-row  table-white-row"
                          key={parent.primary.email}
                        >
                          <Td>
                            {index + 1}. &nbsp;{" "}
                            <span className="uppercase">
                              {parent.primary.firstname}{" "}
                              {parent.primary.lastname}
                            </span>
                          </Td>
                          <Td>{parent.primary.email}</Td>
                          <Td className="flex-row align-center recent-table-actions table-small-actions">
                            <span
                              className="flex-row recent-table-action table-small-action align-center"
                              onClick={() => {
                                showViewParentModal(true);
                                setCurrentParent(parent);
                              }}
                            >
                              <i className="far fa-pencil-alt" /> &nbsp; Edit
                            </span>
                            <span
                              className="flex-row recent-table-action table-small-action align-center"
                              onClick={() => {
                                showViewParentModal(true);
                                setCurrentParent(parent);
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
                {/* <div className="flex-row width-100 align-center justify-end">
                  <Text className="poppins underline px-14 fw-500 pointer">
                    View All Paired Parents
                  </Text>
                </div> */}
              </TableContainer>
              <TableContainer className="recent-table-container-small table-white">
                <Text className="cinzel px-15 uppercase">unpaired parents</Text>
                <br />
                <Table variant="simple" colorScheme="whiteAlpha">
                  <Tbody>
                    {unPairedParents.map((parent, index) => {
                      return (
                        <Tr
                          className="fw-600 poppins recent-table-row table-small-row table-white-row "
                          key={parent.primary.email}
                        >
                          <Td>
                            {index + 1}. &nbsp;{" "}
                            <span className="uppercase">
                              {parent.primary.firstname}{" "}
                              {parent.primary.lastname}
                            </span>
                          </Td>
                          <Td>{parent.email}</Td>
                          <Td className="flex-row align-center recent-table-actions table-small-actions">
                            <span
                              className="flex-row recent-table-action table-small-action align-center"
                              onClick={() => {
                                showViewParentModal(true);
                                setCurrentParent(parent);
                              }}
                            >
                              <i className="far fa-pencil-alt" /> &nbsp; Edit
                            </span>{" "}
                            &nbsp; &nbsp; &nbsp; &nbsp;
                            <span
                              className="flex-row recent-table-action table-small-action align-center"
                              onClick={() => {
                                showViewParentModal(true);
                                setCurrentParent(parent);
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
                    {unPairedParents.length === 0 && (
                      <center>
                        <Text className="poppins fw-500">
                          No unpaired parents
                        </Text>
                      </center>
                    )}
                  </Tbody>
                </Table>
                <br />
                <br />
                {/* <div className="flex-row width-100 align-center justify-end">
                  <Text
                    className="poppins underline px-14 fw-500 pointer"
                    onClick={() => {
                      navigate("/dashboard/surrogates");
                    }}
                  >
                    View All Surrogates
                  </Text>
                </div> */}
              </TableContainer>
            </div>
          </ChakraProvider>
        </div>
      </div>
    </div>
  );
}
