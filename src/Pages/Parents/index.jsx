import { useState } from "react";

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
import { RecentParents } from "../../Assets/Data";
import ParentProfileView from "../ParentProfileView";
import CreatePairing from "../CreatePairing";
export default function Parents() {
  const navigate = useNavigate();
  const [parents, setParents] = useState(RecentParents);
  const [isViewParent, setViewParent] = useState(false);
  const showViewParentModal = (value) => {
    setViewParent(value);
  };
  const [isAddNewPairing, setAddNewPairing] = useState(false);
  const showCreatePairingModal = (value) => {
    setAddNewPairing(value);
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
            <ParentProfileView showViewParentModal={showViewParentModal} />
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
                  {parents.map((parent, index) => {
                    return (
                      <Tr
                        className="fw-600 poppins recent-table-row table-purple-row "
                        key={parent.email}
                      >
                        <Td>
                          {index + 1}. &nbsp;{" "}
                          <span className="uppercase">{parent.name}</span>
                        </Td>
                        <Td>{parent.email}</Td>
                        <Td className="flex-row align-center recent-table-actions">
                          <span
                            className="flex-row recent-table-action align-center"
                            onClick={() => {
                              showViewParentModal(true);
                            }}
                          >
                            <i className="far fa-pencil-alt" /> &nbsp; Edit
                          </span>
                          <span
                            className="flex-row recent-table-action align-center"
                            onClick={() => {
                              showViewParentModal(true);
                            }}
                          >
                            <i className="far fa-eye" /> &nbsp; View
                          </span>
                          <span className="flex-row recent-table-action align-center">
                            {parent.status ? "Deactivate" : "Activate"}
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
                  View All Parents
                </Text>
              </div>
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
                    {parents.map((parent, index) => {
                      return (
                        <Tr
                          className="fw-600 poppins recent-table-row table-small-row  table-white-row"
                          key={parent.email}
                        >
                          <Td>
                            {index + 1}. &nbsp;{" "}
                            <span className="uppercase">{parent.name}</span>
                          </Td>
                          <Td>{parent.email}</Td>
                          <Td className="flex-row align-center recent-table-actions table-small-actions">
                            <span
                              className="flex-row recent-table-action table-small-action align-center"
                              onClick={() => {
                                showViewParentModal(true);
                              }}
                            >
                              <i className="far fa-pencil-alt" /> &nbsp; Edit
                            </span>
                            <span
                              className="flex-row recent-table-action table-small-action align-center"
                              onClick={() => {
                                showViewParentModal(true);
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
                    View All Paired Parents
                  </Text>
                </div>
              </TableContainer>
              <TableContainer className="recent-table-container-small table-white">
                <Text className="cinzel px-15 uppercase">unpaired parents</Text>
                <br />
                <Table variant="simple" colorScheme="whiteAlpha">
                  <Tbody>
                    {parents.map((parent, index) => {
                      return (
                        <Tr
                          className="fw-600 poppins recent-table-row table-small-row table-white-row "
                          key={parent.email}
                        >
                          <Td>
                            {index + 1}. &nbsp;{" "}
                            <span className="uppercase">{parent.name}</span>
                          </Td>
                          <Td>{parent.email}</Td>
                          <Td className="flex-row align-center recent-table-actions table-small-actions">
                            <span
                              className="flex-row recent-table-action table-small-action align-center"
                              onClick={() => {
                                showViewParentModal(true);
                              }}
                            >
                              <i className="far fa-pencil-alt" /> &nbsp; Edit
                            </span>{" "}
                            &nbsp; &nbsp; &nbsp; &nbsp;
                            <span
                              className="flex-row recent-table-action table-small-action align-center"
                              onClick={() => {
                                showViewParentModal(true);
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
