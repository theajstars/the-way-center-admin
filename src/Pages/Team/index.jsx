import { useEffect, useState } from "react";

import {
  Button,
  TextField,
  FormControl,
  Select,
  Typography,
  MenuItem,
  InputLabel,
  Modal,
  Alert,
} from "@mui/material";

import {
  ChakraProvider,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Button as ChakraButton,
  Switch,
} from "@chakra-ui/react";
import { validateEmail } from "../../App";
import { useToasts } from "react-toast-notifications";
import { PerformRequest } from "../../API/PerformRequests";

export default function Team() {
  const { addToast, removeAllToasts } = useToasts();

  const [isTeamLoading, setTeamLoading] = useState(false);
  const [Team, setTeam] = useState([]);
  const [teamCreateVisible, setTeamCreateVisible] = useState(false);

  const getTeam = async () => {
    setTeamLoading(true);
    const r = await PerformRequest.GetTeamDetails({ teamID: undefined }).catch(
      () => {
        setTeamLoading(false);
        addToast("An Error occurred", { appearance: "error" });
      }
    );
    setTeamLoading(false);
    setTeam(r.data.data ?? []);
    console.log(r);
  };
  const [teamForm, setTeamForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    priviledge: "No",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
  });

  const UpdateFormErrors = () => {
    const isEmailValid = validateEmail(teamForm.email);

    setFormErrors({
      ...formErrors,
      firstName: teamForm.firstName.length === 0,
      lastName: teamForm.lastName.length === 0,

      email: !isEmailValid,
    });
  };

  const CreateMember = async () => {
    if (formSubmitting) {
      const errors = Object.values(formErrors).filter((e) => e === true);
      if (errors.length > 0) {
        setFormSubmitting(false);
        addToast("Please fill the form correctly", { appearance: "error" });
      } else {
        const data = {
          email: teamForm.email,
          lastname: teamForm.lastName,
          firstname: teamForm.firstName,
          middlename: "",
          priviledgeAccount: teamForm.priviledge,
        };
        const r = await PerformRequest.CreateTeamMember(data).catch(() => {
          setFormSubmitting(false);
          addToast("An Error occurred", { appearance: "error" });
        });
        setFormSubmitting(false);
        const { message: responseMessage } = r.data;

        if (r.data.status !== "success") {
          addToast(responseMessage, { appearance: "error" });
        } else {
          addToast(responseMessage, { appearance: "success" });
          setTeamCreateVisible(false);
          getTeam();
        }
      }
    }
  };

  useEffect(() => {
    CreateMember();
  }, [formErrors]);
  useEffect(() => {
    getTeam();
  }, []);

  const DeactivateTeamMember = async (memberID) => {
    const r = await PerformRequest.UpdateTeamMember({
      teamID: memberID,
      status: "inactive",
    }).catch(() => {
      addToast("An Error occurred", { appearance: "error" });
    });
    console.log(r);
    getTeam();
  };
  const ActivateTeamMember = async (memberID) => {
    const r = await PerformRequest.UpdateTeamMember({
      teamID: memberID,
      status: "active",
    }).catch(() => {
      addToast("An Error occurred", { appearance: "error" });
    });
    console.log(r);
    getTeam();
  };

  const [currentPriviledgeLoading, setCurrentPriviledgeLoading] = useState("");
  const TogglePriviledges = async ({ memberID, priviledge }) => {
    setCurrentPriviledgeLoading(memberID);
    const r = await PerformRequest.UpdateTeamMember({
      teamID: memberID,
      priviledgeAccount: priviledge,
    }).catch(() => {
      addToast("An Error occurred", { appearance: "error" });
      setCurrentPriviledgeLoading("");
    });
    setCurrentPriviledgeLoading("");
    console.log(r);
    getTeam();
  };
  const defaultHalfInputProps = {
    variant: "standard",
    className: "modal-input-half px-14",
    spellCheck: false,
  };
  return (
    <div className="home-page">
      <Typography className="poppins fw-500" variant="h5">
        ADMIN DASHBOARD
      </Typography>

      <br />
      <br />
      <br />
      <div className="flex-row space-between align-center reports-top">
        <span className="poppins fw-500 px-18 surrogate-reports-head">
          Team
        </span>
        <div className="flex-row align-center">
          <Button
            variant="contained"
            onClick={() => {
              setTeamCreateVisible(true);
            }}
          >
            Create New Member
          </Button>
          &nbsp; &nbsp;
          <Button
            variant="contained"
            onClick={getTeam}
            disabled={isTeamLoading}
          >
            {isTeamLoading ? (
              <>
                Refreshing &nbsp;
                <i className="far fa-spinner-third fa-spin" />
              </>
            ) : (
              <>Refresh</>
            )}
          </Button>
        </div>
      </div>
      <div className="flex-row align-center justify-center width-100">
        {Team.length === 0 ? (
          <Alert severity="info">No team members!</Alert>
        ) : (
          <ChakraProvider>
            <TableContainer>
              <center>
                <Text className="fw-500 px-18">Current Pairings</Text>
              </center>
              <br />
              <Table variant="simple" colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th className="px-17 capitalize">Email</Th>
                    <Th className="px-17 capitalize">Name</Th>
                    <Th className="px-17 capitalize">Phone</Th>
                    <Th className="px-17 capitalize">Priviledged Account</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Team.map((teamMember, index) => {
                    return (
                      <Tr
                        className="fw-600 poppins recent-table-row table-purple-row "
                        key={index}
                      >
                        <Td className="capitalize">{teamMember.email}</Td>
                        <Td className="capitalize">
                          {teamMember.firstname} {teamMember.middlename}{" "}
                          {teamMember.lastname}
                        </Td>
                        <Td className="capitalize">{teamMember.phone}</Td>
                        <Td className="capitalize">
                          <Switch
                            size="md"
                            disabled={
                              currentPriviledgeLoading === teamMember.teamID
                            }
                            isChecked={teamMember.priviledgeAccount === "Yes"}
                            value={teamMember.priviledgeAccount === "Yes"}
                            onChange={() => {
                              TogglePriviledges({
                                memberID: teamMember.teamID,
                                priviledge:
                                  teamMember.priviledgeAccount === "Yes"
                                    ? "No"
                                    : "Yes",
                              });
                            }}
                          />
                        </Td>

                        <Td>
                          {teamMember.status === "active" ? (
                            <ChakraButton
                              colorScheme="red"
                              variant="ghost"
                              onClick={() =>
                                DeactivateTeamMember(teamMember.teamID)
                              }
                            >
                              Deactivate
                            </ChakraButton>
                          ) : (
                            <ChakraButton
                              colorScheme="teal"
                              variant="ghost"
                              onClick={() =>
                                ActivateTeamMember(teamMember.teamID)
                              }
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
      <Modal
        open={teamCreateVisible}
        onClose={(e, reason) => {
          if (reason === "backdropClick") {
            setTeamCreateVisible(false);
          }
        }}
        className="default-modal-container flex-row"
      >
        <div className="default-modal-content modal-scrollbar surrogate-report-modal flex-column">
          <span className="cinzel px-30 uppercase">Create Team Member</span>
          <br />
          <br />
          <center>
            <span className="modal-about modal-about-create-pairing poppins px-15">
              Fill in the details to create a new team member
            </span>
          </center>

          <div className="modal-form-create-pairing-container flex-column align-center">
            <div className="modal-form-create-pairing flex-column">
              <br />
              <br />
              <br />
              <center>
                <Typography fontSize={18}>Member Form</Typography>
              </center>
              <div className="flex-row space-between modal-input-row">
                <TextField
                  {...defaultHalfInputProps}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  label="First Name"
                  value={teamForm.firstName}
                  error={formErrors.firstName}
                  onChange={(e) => {
                    setTeamForm({
                      ...teamForm,
                      firstName: e.target.value,
                    });
                  }}
                />
                <TextField
                  {...defaultHalfInputProps}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  label="Last Name"
                  value={teamForm.lastName}
                  error={formErrors.lastName}
                  onChange={(e) => {
                    setTeamForm({
                      ...teamForm,
                      lastName: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex-row space-between modal-input-row">
                <TextField
                  {...defaultHalfInputProps}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  label="Email Address"
                  value={teamForm.email}
                  error={formErrors.email}
                  onChange={(e) => {
                    setTeamForm({
                      ...teamForm,
                      email: e.target.value,
                    });
                  }}
                />
                <FormControl variant="standard" {...defaultHalfInputProps}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Give Priviledges
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    label="Give Priviledges"
                    value={teamForm.priviledge}
                    onChange={(e) => {
                      setTeamForm({
                        ...teamForm,
                        priviledge: e.target.value,
                      });
                    }}
                  >
                    <MenuItem value={"Yes"} key={"Yes"}>
                      Yes
                    </MenuItem>
                    <MenuItem value={"No"} key={"No"}>
                      No
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
              <br />
              <Button
                variant="contained"
                disabled={formSubmitting}
                onClick={() => {
                  UpdateFormErrors();
                  setFormSubmitting(true);
                }}
              >
                Create &nbsp;
                {formSubmitting && (
                  <i className="far fa-spinner-third fa-spin"></i>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
