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
  ReportCategories,
  SampleSurrogate,
} from "../../Assets/Data";

import Confirmation from "../Confirmation";
import SurrogateUpdate from "../SurrogateUpdate";
import SurrogateReportCreate from "../SurrogateReportCreate";
import { DefaultContext } from "../Dashboard";
import MegaLoader from "../Megaloader";
import { UploadFile } from "../../API/FetchData";

export default function SurrogateProfileView({
  // showViewSurrogateModal,
  isUpdate,
  // surrogate,
}) {
  const ConsumerContext = useContext(DefaultContext);
  const params = useParams();
  const navigate = useNavigate();
  const { removeAllToasts, addToast } = useToasts();
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
  const [showAttachMedia, setShowAttachMedia] = useState(false);

  const [isUploadFile, setUploadFile] = useState(false);

  const reportFileUploadRef = useRef();
  const [reportFile, setReportFile] = useState(undefined);
  const [reportFileType, setReportFileType] = useState("");
  const [reportErrors, setReportErrors] = useState({
    reportFile: false,
    reportType: false,
  });
  const UpdateFileErrors = async () => {
    setReportErrors({
      reportFile: reportFile === undefined,
      reportType: reportFileType.length === 0,
    });
  };
  useEffect(() => {
    AttachMedia();
  }, [reportErrors]);
  const AttachMedia = async () => {
    if (isUploadFile) {
      const errors = Object.values(reportErrors).filter((e) => e === true);
      if (errors.length > 0) {
        setUploadFile(false);

        addToast("Please fill the form correctly", { appearance: "error" });
      } else {
        let reportFileFormData = new FormData();
        reportFileFormData.append(
          "file",
          reportFile,
          reportFile.name.toLowerCase().split(" ").join().replaceAll(",", "")
        );
        const fileUpload = await UploadFile({ formData: reportFileFormData });
        console.log(fileUpload.data.fileUrl);
      }
    }
  };
  const CreateSurrogateReport = () => {
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

  const fileIsLarge = () => {
    addToast("Max File Size: 1.5MB", { appearance: "error" });
  };

  useEffect(() => {
    fetchSurrogate();
  }, []);
  return (
    <>
      <input
        type="file"
        accept=".pdf, .jpg,  .png"
        ref={reportFileUploadRef}
        className="modal-image-hide"
        onChange={(e) => {
          console.log(e.target.files);
          const image = e.target.files[0];
          if (image.size > 1547220) {
            fileIsLarge();
          } else {
            setReportFile(image);
          }
        }}
      />

      {showConfirmationModal && (
        <Confirmation
          modalHeaderText=""
          modalBodyText="Profile Created Successfully"
          modalAction={{
            method: () => {
              setShowConfirmationModal(false);
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
      {showAttachMedia && (
        <Modal
          open={showAttachMedia}
          onClose={(e, reason) => {
            if (reason === "backdropClick") {
              setShowAttachMedia(false);
            }
          }}
          className="default-modal-container flex-row"
        >
          {/* <div className="modal-form-container flex-column align-center width-100"> */}
          <div className="default-modal-content modal-scrollbar surrogate-report-modal flex-column align-center">
            <br />
            <div className="modal-form flex-column align-center width-100">
              <br />
              <span className="fw-600 poppins px-24">Report File</span>
              <br />
              <div className="flex-row space-between modal-input-row width-100">
                <FormControl
                  variant="standard"
                  {...defaultHalfInputProps}
                  disabled={false}
                  // style={{ width: "100%" }}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    Select Report Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={reportFileType}
                    error={reportErrors.reportType}
                    onChange={(e) => {
                      setReportFileType(e.target.value);
                    }}
                    label="Select Report Type"
                  >
                    {ReportCategories.map((report, index) => {
                      return (
                        <MenuItem value={report.name} key={report.name}>
                          {report.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl
                  variant="standard"
                  {...defaultHalfInputProps}
                  disabled={false}
                  // style={{ width: "100%" }}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    Select Report
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={reportFileType}
                    error={reportErrors.reportType}
                    onChange={(e) => {
                      setReportFileType(e.target.value);
                    }}
                    label="Select Report Type"
                  >
                    {ReportCategories.map((report, index) => {
                      return (
                        <MenuItem value={report.name} key={report.name}>
                          {report.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
              <br />
              <span className="flex-column align-center width-100">
                <div className="flex-column modal-form-file-container">
                  <span className="px-13 poppins fw-500">
                    &nbsp; &nbsp; Upload Document
                  </span>
                  <div
                    className="flex-row modal-form-file width-100"
                    style={{
                      borderColor: reportErrors.reportFile ? "red" : "#9a9ab0",
                    }}
                  >
                    <div className="px-13 poppins fw-500">
                      {reportFile ? (
                        reportFile.name
                      ) : (
                        <span>No File Selected</span>
                      )}
                    </div>
                    <span
                      className="px-13 poppins fw-500 modal-form-file-btn flex-row pointer"
                      onClick={() => {
                        reportFileUploadRef.current.click();
                      }}
                    >
                      Upload File
                    </span>
                  </div>
                  <span className="px-13 poppins fw-500 modal-form-file-about">
                    &nbsp; &nbsp; Acceptable format :PDF/JPG/PNG
                  </span>
                </div>
              </span>
            </div>
            <div className="flex-column modal-form-right space-between align-center">
              <br />
              <div className="width-100 flex-column align-center">
                <span
                  className="purple-btn-default px-16 poppins pointer width-100 uppercase modal-form-submit surrogate-form-btn"
                  onClick={() => {
                    setShowAttachMedia(false);
                  }}
                >
                  Cancel &nbsp; <i className="far fa-long-arrow-alt-left" />
                </span>
                <br />
                <Button
                  disabled={isUploadFile}
                  className="purple-btn-default px-16 poppins pointer width-100 uppercase modal-form-submit surrogate-form-btn"
                  onClick={() => {
                    UpdateFileErrors();
                    setUploadFile(true);
                  }}
                >
                  Upload Report &nbsp;{" "}
                  {isUploadFile ? (
                    <i className="far fa-spinner-third fa-spin" />
                  ) : (
                    <i className="far fa-long-arrow-alt-right" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
