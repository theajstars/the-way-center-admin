import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Pagination,
  Select,
  Alert,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import { DefaultContext } from "../Dashboard";
import AishaAvatar from "../../Assets/IMG/AishaAvatar.svg";
import { PerformRequest } from "../../API/PerformRequests";
import CreatePairing from "../CreatePairing";
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
  ChakraProvider,
  Text,
  Button as ChakraButton,
} from "@chakra-ui/react";

export default function Pairings() {
  const navigate = useNavigate();
  const ConsumerContext = useContext(DefaultContext);
  const [pairings, setPairings] = useState([]);
  const [isPairingsLoading, setPairingsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [parentID, setParentID] = useState("");
  const [surrogateID, setSurrogateID] = useState("");

  useEffect(() => {
    if (parentID.length > 0) {
      setSurrogateID("");
    }
  }, [parentID]);
  useEffect(() => {
    if (surrogateID.length > 0) {
      setParentID("");
    }
  }, [surrogateID]);
  const getPairings = async () => {
    setPairingsLoading(true);
    const r = await PerformRequest.GetPairing({
      page: currentPage,
      limit: pageSize,
    }).catch(() => {
      setPairingsLoading(false);
    });
    setPairingsLoading(false);
    console.log("Pairings", r);
    if (r.data.status === "success") {
      setPairings(r.data.data ?? []);
      setTotalPages(r.data.totalPages);
    }
  };
  const FilterPairings = async () => {
    setPairingsLoading(true);
    const r = await PerformRequest.GetPairing({
      page: currentPage,
      limit: pageSize,
      parentID: parentID,
      surrogateID: surrogateID,
    }).catch(() => {
      setPairingsLoading(false);
    });
    setPairingsLoading(false);
    console.log("Pairings", r);
    if (r.data.status === "success") {
      setPairings(r.data.data ?? []);
      setTotalPages(r.data.totalPages);
    }
  };

  useEffect(() => {
    FilterPairings();
  }, [currentPage]);
  const defaultFullInputProps = {
    variant: "standard",
    spellCheck: false,
    className: "modal-input-full px-12",
  };
  const defaultHalfInputProps = {
    variant: "outlined",
    className: "filter-input px-12",
    spellCheck: false,
    size: "small",
  };
  const [isAddNewPairing, setAddNewPairing] = useState(false);
  const showCreatePairingModal = (value) => {
    setAddNewPairing(value);
  };

  const DeactivatePairing = async (pairingID) => {
    const r = await PerformRequest.UpdatePairing({
      pairingID,
      status: "inactive",
    }).catch(() => {
      setPairingsLoading(false);
    });
    setPairingsLoading(false);
    getPairings();
  };
  const ActivatePairing = async (pairingID) => {
    const r = await PerformRequest.UpdatePairing({
      pairingID,
      status: "active",
    }).catch(() => {
      setPairingsLoading(false);
    });
    setPairingsLoading(false);
    getPairings();
  };

  const [pairingRequests, setPairingRequests] = useState([]);
  const [isRequestsLoading, setRequestsLoading] = useState(false);
  const [currentRequestPage, setCurrentRequestPage] = useState(1);
  const [requestPageSize, setRequestPageSize] = useState(10);
  const [totalRequestPages, setTotalRequestPages] = useState(1);

  const getPairingRequests = async () => {
    setRequestsLoading(true);
    const r = await PerformRequest.GetPairingRequests({
      page: currentRequestPage,
      limit: requestPageSize,
    }).catch(() => {
      setRequestsLoading(false);
    });
    setRequestsLoading(false);
    console.log("Requests", r);
    if (r.data.status === "success") {
      setPairingRequests(r.data.data ?? []);
      setTotalRequestPages(r.data.totalPages);
    }
  };

  useEffect(() => {
    FilterPairings();
  }, [currentPage]);
  useEffect(() => {
    getPairingRequests();
  }, [currentRequestPage]);
  return (
    <div className="home-page">
      <Typography className="poppins fw-500" variant="h5">
        ADMIN DASHBOARD
      </Typography>

      <br />
      <br />
      <br />
      <div className="flex-row space-between align-center reports-top">
        <span className="poppins fw-500 px-16 surrogate-reports-head">
          Pairings
        </span>
        <div className="flex-row align-center">
          <Button
            variant="contained"
            onClick={() => {
              setAddNewPairing(true);
            }}
          >
            New Pairing
          </Button>
          &nbsp; &nbsp;
          <Button
            variant="contained"
            onClick={getPairings}
            disabled={isPairingsLoading}
          >
            {isPairingsLoading ? (
              <>
                Refreshing <i className="far fa-spinner-third fa-spin" />
              </>
            ) : (
              <>Refresh</>
            )}
          </Button>
        </div>
      </div>
      <div className="flex-row align-center space-between filter-container">
        <div className="flex-row filter-inputs align-center">
          <FormControl variant="standard" {...defaultHalfInputProps}>
            <InputLabel id="demo-simple-select-standard-label">
              Parents Name
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={parentID}
              onChange={(e) => {
                setParentID(e.target.value);
              }}
              label="Parents Name"
            >
              {ConsumerContext.Parents.map((parent, index) => {
                return (
                  <MenuItem value={parent.id} key={parent.id}>
                    {parent.primary.firstname} {parent.primary.lastname}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl variant="standard" {...defaultHalfInputProps}>
            <InputLabel id="demo-simple-select-standard-label">
              Surrogates Name
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={surrogateID}
              onChange={(e) => {
                setSurrogateID(e.target.value);
              }}
              label="Surrogates Name"
            >
              {ConsumerContext.Surrogates.map((surrogate, index) => {
                return (
                  <MenuItem value={surrogate.id} key={surrogate.id}>
                    {surrogate.primary.firstname} {surrogate.primary.lastname}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="flex-row filter-buttons align-center">
          <Button variant="contained" onClick={FilterPairings}>
            Filter &nbsp; <i className="far fa-search" />
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button
            variant="contained"
            disabled={parentID.length === 0 && surrogateID.length === 0}
            onClick={() => {
              setSurrogateID("");
              setParentID("");
            }}
          >
            Clear &nbsp; <i className="far fa-times" />
          </Button>
        </div>
      </div>
      <div className="flex-row align-center justify-center width-100">
        {pairings.length === 0 ? (
          <Alert severity="info">No pairings found!</Alert>
        ) : (
          <ChakraProvider>
            <TableContainer>
              <center>
                <Text className="fw-500 px-16">Current Pairings</Text>
              </center>
              <br />
              <Table variant="simple" colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th className="px-15 capitalize">Pairing ID</Th>
                    <Th className="px-15 capitalize">Parent name</Th>
                    <Th className="px-15 capitalize">Surrogate Name</Th>
                    <Th className="px-15 capitalize">Toggle Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pairings.map((pairing, index) => {
                    return (
                      <Tr
                        className="fw-600 poppins recent-table-row table-purple-row "
                        key={index}
                      >
                        <Td className="capitalize">{pairing.id}</Td>
                        <Td
                          className="capitalize pointer"
                          onClick={() => {
                            navigate(
                              `/dashboard/parent/${pairing.parent.parentID}`
                            );
                          }}
                        >
                          {pairing.parent.firstname} {pairing.parent.lastname}
                        </Td>
                        <Td
                          className="capitalize pointer"
                          onClick={() => {
                            navigate(
                              `/dashboard/surrogate/${pairing.surrogate.surrogateID}`
                            );
                          }}
                        >
                          {pairing.surrogate.firstname}{" "}
                          {pairing.surrogate.lastname}
                        </Td>
                        <Td>
                          {pairing.status === "active" ? (
                            <ChakraButton
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => DeactivatePairing(pairing.id)}
                            >
                              Deactivate
                            </ChakraButton>
                          ) : (
                            <ChakraButton
                              colorScheme="teal"
                              variant="ghost"
                              onClick={() => ActivatePairing(pairing.id)}
                            >
                              Activate
                            </ChakraButton>
                          )}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </ChakraProvider>
        )}
      </div>
      {isAddNewPairing && (
        <CreatePairing showCreatePairingModal={showCreatePairingModal} />
      )}
      <div className="flex-row width-100 align-center justify-center">
        <Pagination
          disabled={isPairingsLoading}
          count={totalPages}
          onChange={(e, value) => {
            setCurrentPage(value);
          }}
        />
      </div>
      <br />
      <Divider />
      <br />
      <div className="flex-row align-center justify-center width-100">
        {pairingRequests.length === 0 ? (
          <Alert severity="info">No Request for pairing!</Alert>
        ) : (
          <ChakraProvider>
            <TableContainer>
              <center>
                <Text className="fw-500 px-16">Pairing Requests</Text>
              </center>
              <br />
              <Table variant="simple" colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th className="px-15 capitalize">Parent name</Th>
                    <Th className="px-15 capitalize">Religion</Th>
                    <Th className="px-15 capitalize">Tribe</Th>
                    <Th className="px-15 capitalize">Age Range</Th>
                    <Th className="px-15 capitalize">Education Level</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pairingRequests.map((request, index) => {
                    const parentID = "";
                    return (
                      <Tr
                        className="fw-600 poppins recent-table-row table-purple-row "
                        key={index}
                      >
                        <Td
                          className="capitalize"
                          onClick={() => {
                            navigate(`/dashboard/parent/${parentID}`);
                          }}
                        >
                          {request.parent.firstname} {request.parent.lastname}
                        </Td>
                        <Td className="capitalize">{request.religion}</Td>
                        <Td className="capitalize">{request.tribe}</Td>
                        <Td className="capitalize">{request.ageRange}</Td>
                        <Td className="capitalize">{request.educationLevel}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </ChakraProvider>
        )}
      </div>
      <div className="flex-row width-100 align-center justify-center">
        <Pagination
          disabled={isRequestsLoading}
          count={totalRequestPages}
          onChange={(e, value) => {
            setCurrentRequestPage(value);
          }}
        />
      </div>
    </div>
  );
}
