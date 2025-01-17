import { useState, useRef, useContext, useEffect } from "react";

import {
  InputLabel,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import ImageSelectorPlaceholder from "../../Assets/IMG/ImageSelectorPlaceholder.svg";
import { useToasts } from "react-toast-notifications";
import { DateField, DatePicker } from "@mui/x-date-pickers";
import {
  CountriesList,
  CovidVaccinationDosage,
  Diseases,
  initialSurrogateReport,
  RecentParents,
  ReportCategories,
} from "../../Assets/Data";
import dayjs from "dayjs";

import Confirmation from "../Confirmation";
import { DefaultContext } from "../Dashboard";
import { PerformRequest } from "../../API/PerformRequests";
import { UploadFile } from "../../API/FetchData";

export default function SurrogateReportCreate({
  showSurrogateReportModal,
  surrogate,
}) {
  const [isModalOpen, setModalOpen] = useState(true);
  const ContextConsumer = useContext(DefaultContext);

  const [currentSurrogate, setCurrentSurrogate] = useState({
    id: "",
    primary: { firstname: "", lastname: "" },
  });
  const { addToast, removeAllToasts } = useToasts();

  const [currentFormSection, setCurrentFormSection] = useState(1);
  const [surrogateReport, setSurrogateReport] = useState(
    initialSurrogateReport
  );
  const reportFileUploadRef = useRef();
  const [reportFile, setReportFile] = useState(undefined);
  const [reportFileType, setReportFileType] = useState("");

  const [reportErrors, setReportErrors] = useState({
    reportFile: false,
    reportType: false,
  });

  const defaultFullInputProps = {
    variant: "standard",
    spellCheck: false,
    className: "modal-input-full px-14",
  };
  const defaultHalfInputProps = {
    variant: "standard",
    className: "modal-input-half px-14",
    spellCheck: false,
  };

  const disabledInputProps = {
    disabled: true,
    style: {
      cursor: "pointer",
    },
  };

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const getConfirmationModalStatus = (value) => {
    setShowConfirmationModal(value);
    if (!value) {
      showSurrogateReportModal(false);
    }
  };
  const SendReportCreatedNotification = async () => {
    setConfirmationModalParams({
      modalHeaderText: "great job. message sent",
      modalAction: {
        method: () => {
          setShowConfirmationModal(false);
          showSurrogateReportModal(false);
          setCurrentFormSection(1);
        },
        text: "submit another report",
      },
      showModalBody: false,
      modalBodyText: "",
      modalLink: {
        text: "Back to Dashboard",
        route: "/dashboard",
      },
      getConfirmationModalStatus: getConfirmationModalStatus,
    });
  };
  const [confirmationModalParams, setConfirmationModalParams] = useState({
    modalHeaderText: "Surrogate Health Update",
    modalBodyText: "Report has been updated, you can now push a message!",
    modalAction: {
      method: SendReportCreatedNotification,
      text: "send notification",
    },
    modalLink: {
      text: "Back to Dashboard",
      route: "/dashboard",
    },
    getConfirmationModalStatus: getConfirmationModalStatus,
  });

  const [formSubmitting, setFormSubmitting] = useState(false);

  const [formErrors, setFormErrors] = useState({
    parentID: false,
    surrogateID: false,
    reportCategory: false,
    healthPractitioner: false,
    healthCareCenter: false,
    details: false,
  });

  const UpdateFormErrors = () => {
    setFormErrors({
      ...formErrors,
      parentID: surrogateReport.parentID.length === 0,
      surrogateID: !surrogate && currentSurrogate.id.length === 0,
      reportCategory: surrogateReport.reportCategory.length === 0,
      healthPractitioner: surrogateReport.healthPractitioner.length === 0,
      healthCareCenter: surrogateReport.healthCareCenter.length === 0,
      details: surrogateReport.details.length === 0,
    });
  };

  useEffect(() => {
    CreateReport();
  }, [formErrors]);
  const getPairingDetails = async () => {
    const r = await PerformRequest.GetPairing({
      surrogateID: surrogate ? surrogate.id : currentSurrogate.id,
    }).catch(() => {
      addToast("Could not get pairing details!", { appearance: "error" });
    });
    console.log("Pairing details: ", r.data.data);
    if (r.data.status === "success" && r.data.data) {
      setSurrogateReport({
        ...surrogateReport,
        parentID: r.data.data[0].parent.parentID,
      });
    }
  };
  useEffect(() => {
    if (!surrogate && currentSurrogate.id.length === 0) {
      // No Surrogate is Set, so do nothing
    } else {
      getPairingDetails();
    }
  }, [surrogate, currentSurrogate]);
  const CreateReport = async () => {
    console.log(formErrors);
    if (formSubmitting) {
      const errors = Object.values(formErrors).filter((e) => e === true);
      if (errors.length > 0) {
        setFormSubmitting(false);

        addToast("Please fill the form correctly", { appearance: "error" });
      } else {
        const data = {
          parentID: surrogateReport.parentID,
          surrogateID: surrogate ? surrogate.id : currentSurrogate.id,
          reportCategory: surrogateReport.reportCategory,
          healthPractitioner: surrogateReport.healthPractitioner,
          healthCareCenter: surrogateReport.healthCareCenter,
          details: surrogateReport.details,
          appointmentDate: surrogateReport.appointmentDate,
        };
        console.log(data);

        const createReport = await PerformRequest.CreateReport(data).catch(
          () => {
            setFormSubmitting(false);
          }
        );
        setFormSubmitting(false);
        removeAllToasts();
        console.log(createReport);
        const { message: responseMessage } = createReport.data;
        if (createReport.data.status === "failed") {
          addToast(responseMessage, { appearance: "error" });
        } else {
          addToast(responseMessage, { appearance: "success" });
          ContextConsumer.refetchData();
          setShowConfirmationModal(true);
        }
        // setShowConfirmationModal(true);
      }
    }
  };
  const [isUploadFile, setUploadFile] = useState(false);

  useEffect(() => {
    attachReportFile();
  }, [reportErrors]);
  const attachReportFile = async () => {
    console.log(reportErrors);
    if (isUploadFile) {
      let reportFileFormData = new FormData();
      reportFileFormData.append(
        "file",
        reportFile,
        reportFile.name.toLowerCase().split(" ").join().replaceAll(",", "")
      );

      const uploadReportFile = await UploadFile({
        formData: reportFileFormData,
      });
      console.log(uploadReportFile);
      if (uploadReportFile.data.status === "success") {
        const data = {
          reportID: "",
          reportType: "",
          file: "",
        };
        const createReportFile = await PerformRequest.AddReportFile;
      }
    }
  };
  const fileIsLarge = () => {
    addToast("Max File Size: 1.5MB", { appearance: "error" });
  };
  return (
    <>
      {showConfirmationModal && <Confirmation {...confirmationModalParams} />}
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

      <Modal
        open={isModalOpen}
        onClose={(e, reason) => {
          if (reason === "backdropClick") {
            setModalOpen(false);
            showSurrogateReportModal(false);
          }
        }}
        className="default-modal-container flex-row"
      >
        <div className="default-modal-content modal-scrollbar surrogate-report-modal flex-column">
          <span className="cinzel px-30 uppercase">
            create surrogate report
          </span>
          <br />
          <span className="modal-about poppins px-15">
            Fill in the data for surrogate report correctly. It will take a
            couple of minutes
          </span>

          {currentFormSection === 1 && (
            <div className="modal-form-container flex-row">
              <div className="modal-form flex-column">
                <br />
                <span className="fw-600 poppins px-24">
                  Surrogate Health Update
                </span>
                <br />

                <div className="flex-row space-between modal-input-row">
                  <FormControl variant="standard" {...defaultHalfInputProps}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Select Parent
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={surrogateReport.parentID}
                      error={formErrors.parentID}
                      disabled
                      onChange={(e) => {
                        setSurrogateReport({
                          ...surrogateReport,
                          parentID: e.target.value,
                        });
                      }}
                      label="Select Parent"
                    >
                      {ContextConsumer.Parents.map((parent, index) => {
                        return (
                          <MenuItem value={parent.id} key={parent.id}>
                            {parent.primary.firstname}&nbsp;
                            {parent.primary.lastname}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <FormControl variant="standard" {...defaultHalfInputProps}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Select Surrogate
                    </InputLabel>
                    {surrogate ? (
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={surrogate.id}
                        label="Select Surrogate"
                        placeholder="Select Surrogate"
                        {...disabledInputProps}
                      >
                        <MenuItem value={surrogate.id} key={surrogate.id}>
                          {surrogate.primary.firstname} &nbsp;
                          {surrogate.primary.lastname}
                        </MenuItem>
                      </Select>
                    ) : (
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={currentSurrogate}
                        error={formErrors.surrogateID}
                        label="Select Surrogate"
                        placeholder="Select Surrogate"
                        onChange={(e) => {
                          setCurrentSurrogate(e.target.value);
                        }}
                      >
                        {ContextConsumer.Surrogates.map((surrogate) => {
                          return (
                            <MenuItem value={surrogate} key={surrogate.id}>
                              {surrogate.primary.firstname} &nbsp;
                              {surrogate.primary.lastname}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  </FormControl>
                </div>
                <div className="flex-row space-between modal-input-row">
                  <FormControl variant="standard" {...defaultHalfInputProps}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Category of Report
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={surrogateReport.reportCategory}
                      error={formErrors.reportCategory}
                      onChange={(e) => {
                        setSurrogateReport({
                          ...surrogateReport,
                          reportCategory: e.target.value,
                        });
                      }}
                      label="Category of Report"
                    >
                      {ReportCategories.map((report, index) => {
                        return (
                          <MenuItem value={report.value} key={report.name}>
                            {report.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <DatePicker
                    defaultValue={dayjs("2023-01-01")}
                    {...defaultHalfInputProps}
                    slotProps={{
                      textField: { variant: "standard" },
                    }}
                    value={surrogateReport.appointmentDate}
                    onChange={(e) => {
                      console.log(dayjs(e).toDate());
                      setSurrogateReport({
                        ...surrogateReport,
                        appointmentDate: e,
                      });
                    }}
                    label="Date of Next Appointment"
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    {...defaultHalfInputProps}
                    id="standard-multiline-static"
                    label="Health Practitioner"
                    placeholder="Health Practitioner"
                    variant="standard"
                    value={surrogateReport.healthPractitioner}
                    error={formErrors.healthPractitioner}
                    onChange={(e) =>
                      setSurrogateReport({
                        ...surrogateReport,
                        healthPractitioner: e.target.value,
                      })
                    }
                  />
                  <TextField
                    {...defaultHalfInputProps}
                    id="standard-multiline-static"
                    label="Health Care Center"
                    placeholder="Health Care Center"
                    variant="standard"
                    value={surrogateReport.healthCareCenter}
                    error={formErrors.healthCareCenter}
                    onChange={(e) =>
                      setSurrogateReport({
                        ...surrogateReport,
                        healthCareCenter: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    {...defaultFullInputProps}
                    id="standard-multiline-static"
                    label="Overview"
                    multiline
                    rows={5}
                    placeholder="Overview"
                    variant="standard"
                    value={surrogateReport.details}
                    error={formErrors.details}
                    onChange={(e) =>
                      setSurrogateReport({
                        ...surrogateReport,
                        details: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex-column modal-form-right space-between">
                <span></span>
                <span
                  className="purple-btn-default px-16 poppins pointer width-100 uppercase modal-form-submit surrogate-form-btn"
                  onClick={() => {
                    UpdateFormErrors();
                    setFormSubmitting(true);
                    // setCurrentFormSection(2);
                  }}
                >
                  CREATE REPORT &nbsp;{" "}
                  <i className="far fa-long-arrow-alt-right" />
                </span>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
