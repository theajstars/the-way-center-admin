import { useState, useEffect, useRef, useContext } from "react";

import { useParams, useNavigate } from "react-router-dom";

import {
  InputLabel,
  Modal,
  Input,
  InputAdornment,
  TextField,
  Select,
  Button,
  MenuItem,
  FormControl,
  Divider,
} from "@mui/material";
import ImageSelectorPlaceholder from "../../Assets/IMG/ImageSelectorPlaceholder.svg";
import { DateField, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useToasts } from "react-toast-notifications";
import { PerformRequest } from "../../API/PerformRequests";
import {
  CountriesList,
  CovidVaccinationDosage,
  Diseases,
  initialSurrogate,
  SampleSurrogate,
} from "../../Assets/Data";

import Confirmation from "../Confirmation";
import SurrogateUpdate from "../SurrogateUpdate";
import SurrogateReportCreate from "../SurrogateReportCreate";
import { DefaultContext } from "../Dashboard";
import MegaLoader from "../Megaloader";

export default function SurrogateProfileView({
  // showViewSurrogateModal,
  isUpdate,
  // surrogate,
}) {
  const ConsumerContext = useContext(DefaultContext);
  const params = useParams();
  const navigate = useNavigate();
  const { removeAllToasts, addToast } = useToasts();
  const [isModalOpen, setModalOpen] = useState(true);
  const [surrogateLoading, setSurrogateLoading] = useState(false);
  const [surrogate, setSurrogate] = useState(initialSurrogate);
  const defaultFullInputProps = {
    disabled: true,
    className: "black-text",
    // className: "modal-input-full px-14",
  };
  const defaultHalfInputProps = {
    disabled: true,
    className: "modal-input-half px-14 black-text",
    spellCheck: false,
  };

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const [showCreateReport, setShowCreateReport] = useState(false);

  const CreateSurrogateReport = () => {
    setModalOpen(false);
    setShowCreateReport(true);
  };
  const fetchSurrogate = async () => {
    setSurrogateLoading(true);
    const { surrogateID } = params;
    const r = await PerformRequest.GetAllSurrogates({ surrogateID }).catch(
      () => {
        setSurrogateLoading(false);
      }
    );
    if (r.data.status === "success" && r.data.data) {
      setSurrogate(r.data.data[0]);
    } else {
      addToast("Surrogate Not Found... Redirecting", { appearance: "error" });
      setTimeout(() => navigate("/dashboard/surrogates"), 1500);
    }
    setSurrogateLoading(false);
    console.log(r);
  };

  useEffect(() => {
    fetchSurrogate();
  }, []);
  return (
    <>
      {showConfirmationModal && (
        <Confirmation
          modalHeaderText=""
          modalBodyText="Profile Created Successfully"
          modalAction={{
            method: () => {
              setShowConfirmationModal(false);
              setModalOpen(true);
            },
            text: "Create Another Profile",
          }}
          modalLink={{
            text: "Back to Dashboard",
            route: "/dashboard",
          }}
          getConfirmationModalStatus={(value) => console.log(value)}
        />
      )}
      {showCreateReport && (
        <SurrogateReportCreate
          showSurrogateReportModal={(value) => setShowCreateReport(value)}
          surrogate={surrogate}
        />
      )}

      {/* <Modal
        open={isModalOpen}
        onClose={(e, reason) => {
          if (reason === "backdropClick") {
            setModalOpen(false);
            showViewSurrogateModal(false);
          }
        }}
        className="default-modal-container flex-row"
      > */}
      {/* <div className="default-modal-content modal-scrollbar surrogate-report-modal flex-column"> */}
      {surrogateLoading ? (
        <MegaLoader />
      ) : (
        <div className="surrogate-content flex-column">
          <span className="cinzel px-30 uppercase">VIEW SURROGATE PROFILE</span>
          <br />
          <span className="modal-about poppins px-15">
            Fill in the data for surrogate profile correctly. It will take a
            couple of minutes
          </span>

          <div className="modal-form-container flex-row">
            <div className="modal-form flex-column">
              <br />
              <span className="fw-600 poppins px-24">Surrogate Bio-Data</span>
              <br />
              <div className="flex-row space-between modal-input-row">
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <Input
                    id="standard-adornment-amount"
                    {...defaultFullInputProps}
                    value={`${surrogate.primary.firstname} ${surrogate.primary.lastname}`}
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="fw-500 poppins px-15 black-text">
                          Full Name
                        </span>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>

              <div className="flex-row space-between modal-input-row">
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <Input
                    id="standard-adornment-amount"
                    {...defaultFullInputProps}
                    value={`${surrogate.address}`}
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="fw-500 poppins px-15 black-text">
                          Address
                        </span>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>
              <div className="flex-row space-between modal-input-row">
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <Input
                    id="standard-adornment-amount"
                    {...defaultFullInputProps}
                    value={`${surrogate.primary.email}`}
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="fw-500 poppins px-15 black-text">
                          Primary Email Address
                        </span>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>

              <div className="flex-row space-between modal-input-row">
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <Input
                    id="standard-adornment-amount"
                    {...defaultFullInputProps}
                    value={`${surrogate.primary.phone}`}
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="fw-500 poppins px-15 black-text">
                          Primary Phone Number
                        </span>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>

              <div className="flex-row space-between modal-input-row">
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <Input
                    id="standard-adornment-amount"
                    {...defaultFullInputProps}
                    value={`${
                      parseInt(surrogate.pair) > 0 ? "Paired" : "Unpaired"
                    }`}
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="fw-500 poppins px-15 black-text">
                          Pairing Status
                        </span>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>
              <div className="flex-row space-between modal-input-row">
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <Input
                    id="standard-adornment-amount"
                    {...defaultFullInputProps}
                    value={surrogate.primary.nin}
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="fw-500 poppins px-15 black-text">
                          NIN
                        </span>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>
              {surrogate.extendedInfo.map((info) => {
                return (
                  <div
                    className="flex-row space-between modal-input-row"
                    key={info.kyc}
                  >
                    {info.field === "covidVaccinationCertificate" ? (
                      <div className="flex-row align-center">
                        &nbsp;&nbsp;
                        <span className="poppins fw-500">{info.kyc}</span>
                        &nbsp;&nbsp;
                        <a className="poppins fw-300" href={info.value}>
                          Download
                        </a>
                      </div>
                    ) : (
                      <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <Input
                          id="standard-adornment-amount"
                          {...defaultFullInputProps}
                          value={info.value}
                          startAdornment={
                            <InputAdornment position="start">
                              <span className="fw-500 poppins px-15 black-text">
                                {info.kyc}
                              </span>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    )}
                  </div>
                );
              })}
              <div className="flex-row space-between modal-input-row">
                <Divider style={{ width: "100%" }} />
              </div>
              <div className="flex-row space-between modal-input-row">
                <span className="poppins px-16">
                  &nbsp;&nbsp;<u>Next of Kin Details</u>
                </span>
              </div>
              <div className="flex-row space-between modal-input-row">
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <Input
                    id="standard-adornment-amount"
                    {...defaultFullInputProps}
                    value={surrogate.primary.nok.fullname}
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="fw-500 poppins px-15 black-text">
                          Fullname
                        </span>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>
              <div className="flex-row space-between modal-input-row">
                <FormControl
                  fullWidth
                  sx={{ m: 1 }}
                  variant="standard"
                  {...defaultHalfInputProps}
                >
                  <Input
                    id="standard-adornment-amount"
                    value={`${surrogate.primary.nok.nin}`}
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="fw-500 poppins px-15 black-text">
                          NIN
                        </span>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  sx={{ m: 1 }}
                  variant="standard"
                  {...defaultHalfInputProps}
                >
                  <Input
                    id="standard-adornment-amount"
                    value={`${surrogate.primary.nok.phone}`}
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="fw-500 poppins px-15 black-text">
                          Phone
                        </span>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>
              <div className="flex-row space-between modal-input-row">
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <Input
                    id="standard-adornment-amount"
                    {...defaultFullInputProps}
                    value={surrogate.primary.nok.address}
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="fw-500 poppins px-15 black-text">
                          Address
                        </span>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>
              <div className="flex-row space-between modal-input-row">
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <Input
                    id="standard-adornment-amount"
                    {...defaultFullInputProps}
                    value={surrogate.primary.nok.relationship}
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="fw-500 poppins px-15 black-text">
                          Relationship
                        </span>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>
            </div>
            <div className="flex-column modal-form-right space-between">
              <span className="flex-column align-center width-100">
                <div className="modal-form-image-container modal-form-image-container-small flex-row">
                  <img
                    src={surrogate.primary.mainImage}
                    alt=""
                    className="modal-form-image"
                  />
                </div>
                <br />

                <br />
                <div className="modal-form-image-container modal-form-image-container-small flex-row">
                  <img
                    src={surrogate.primary.secondImage}
                    alt=""
                    className="modal-form-image"
                  />
                </div>
                <br />
              </span>
              <br />
              <div className="flex-column">
                <Button
                  variant="contained"
                  onClick={CreateSurrogateReport}
                  fullWidth
                >
                  Create Report
                </Button>

                <br />
                {/* <span
                className="purple-btn-default px-16 poppins pointer width-100 uppercase modal-form-submit surrogate-form-btn"
                onClick={() => {
                  showViewSurrogateModal(false);
                }}
              >
                Exit Profile
              </span> */}
              </div>
            </div>
          </div>
          <div className="flex-row width-100 align-center">
            <Button
              variant="outlined"
              style={{
                borderColor: "rgba(162, 89, 255, 0.42)",
                borderWidth: "2px",
                color: "#000",
              }}
            >
              Deactivate Profile &nbsp; <i className="far fa-times" />
            </Button>
            <Button
              onClick={() => {
                // setUpdateProfile(true);
                navigate(`/dashboard/surrogate/update/${surrogate.id}`);
              }}
              style={{
                borderWidth: "2px",
                marginLeft: "20px",
              }}
            >
              Edit Profile &nbsp; <i className="far fa-pencil" />
            </Button>
          </div>
        </div>
      )}
      {/* </Modal> */}
      <br />
      <br />
    </>
  );
}
