import { useState, useRef } from "react";

import {
  InputLabel,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import ImageSelectorPlaceholder from "../../Assets/IMG/ImageSelectorPlaceholder.svg";
import { DateField, DatePicker } from "@mui/x-date-pickers";
import {
  CountriesList,
  CovidVaccinationDosage,
  Diseases,
  NextOfKinRelationships,
  RecentParents,
  ReportCategories,
} from "../../Assets/Data";
import dayjs from "dayjs";

import Confirmation from "../Confirmation";

const initialSurrogateReport = {
  parent: "",
  surrogate: "",
  categoryOfReport: "",
  doctorName: "",
  nextAppointmentDate: dayjs("2023-01-01"),
  overview: "",
  reportFile: undefined,
  reportType: "",
};
export default function SurrogateReportCreate({ showSurrogateReportModal }) {
  const [isModalOpen, setModalOpen] = useState(true);

  const [currentFormSection, setCurrentFormSection] = useState(1);
  const [surrogateReport, setSurrogateReport] = useState(
    initialSurrogateReport
  );
  const reportFileUploadRef = useRef();
  const secondaryImageUploadRef = useRef();

  const govtIdentificationUploadRef = useRef();
  const covidVaccinationUploadRef = useRef();
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
  const CreateSurrogateProfile = () => {
    setModalOpen(false);
    setShowConfirmationModal(true);
    showSurrogateReportModal(true);
  };
  const getConfirmationModalStatus = (value) => {
    setShowConfirmationModal(value);
    if (!value) {
      showSurrogateReportModal(false);
    }
  };
  const SendReportCreatedNotification = () => {
    setConfirmationModalParams({
      modalHeaderText: "great job. message sent",
      modalAction: {
        method: () => {
          setShowConfirmationModal(false);
          setSurrogateReport(initialSurrogateReport);
        },
        text: "submit another report",
      },
      showModalBody: false,
      modalBodyText: "",
      modalLink: {
        text: "Back to Dashboard",
        route: "/dashboard",
      },
      getConfirmationModalStatus: { getConfirmationModalStatus },
    });
  };
  const [confirmationModalParams, setConfirmationModalParams] = useState({
    modalHeaderText: "Surrogate Health Update",
    modalBodyText:
      "Aisha Immanuel’s Report has been updated, you can now push a message to Jones.",
    modalAction: {
      method: SendReportCreatedNotification,
      text: "send notification",
    },
    modalLink: {
      text: "Back to Dashboard",
      route: "/dashboard",
    },
    getConfirmationModalStatus: { getConfirmationModalStatus },
  });
  return (
    <>
      {showConfirmationModal && <Confirmation {...confirmationModalParams} />}
      <input
        type="file"
        accept=".pdf, .jpg, .jpeg, .png"
        ref={reportFileUploadRef}
        className="modal-image-hide"
        onChange={(e) => {
          console.log(e.target.files);
          const image = e.target.files[0];
          setSurrogateReport({
            ...surrogateReport,
            reportFile: image,
          });
        }}
      />
      <input
        type="file"
        accept=".pdf, .jpg, .jpeg, .png"
        ref={secondaryImageUploadRef}
        className="modal-image-hide"
        onChange={(e) => {
          console.log(e.target.files);
          const image = e.target.files[0];
          setSurrogateReport({
            ...surrogateReport,
            secondaryImage: URL.createObjectURL(image),
          });
        }}
      />
      <input
        type="file"
        accept=".pdf, .jpg, .jpeg, .png"
        ref={govtIdentificationUploadRef}
        className="modal-image-hide"
        onChange={(e) => {
          console.log(e.target.files);
          const file = e.target.files[0];
          setSurrogateReport({
            ...surrogateReport,
            govtIdentificationFile: file,
          });
        }}
      />
      <input
        type="file"
        accept=".pdf, .jpg, .jpeg, .png"
        ref={covidVaccinationUploadRef}
        className="modal-image-hide"
        onChange={(e) => {
          console.log(e.target.files);
          const file = e.target.files[0];
          setSurrogateReport({
            ...surrogateReport,
            covidVaccinationFile: file,
          });
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

          {currentFormSection === 1 ? (
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
                      value={surrogateReport.parent}
                      onChange={(e) => {
                        setSurrogateReport({
                          ...surrogateReport,
                          parent: e.target.value,
                        });
                      }}
                      label="Select Parent"
                    >
                      {RecentParents.map((parent, index) => {
                        return (
                          <MenuItem value={parent.name} key={parent.name}>
                            {parent.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <FormControl variant="standard" {...defaultHalfInputProps}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Surrogate-NB (Auto Select)
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={surrogateReport.parent}
                      onChange={(e) => {
                        setSurrogateReport({
                          ...surrogateReport,
                          parent: e.target.value,
                        });
                      }}
                      label="Surrogate-NB (Auto Select)"
                      {...disabledInputProps}
                    >
                      {RecentParents.map((parent, index) => {
                        return (
                          <MenuItem value={parent.name} key={parent.name}>
                            {parent.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
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
                      value={surrogateReport.categoryOfReport}
                      onChange={(e) => {
                        setSurrogateReport({
                          ...surrogateReport,
                          categoryOfReport: e.target.value,
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
                    value={surrogateReport.nextAppointmentDate}
                    onChange={(e) => {
                      console.log(e);
                      console.log(dayjs(e).toDate());
                      setSurrogateReport({
                        ...surrogateReport,
                        nextAppointmentDate: e,
                      });
                    }}
                    label="Date of Next Appointment"
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <FormControl variant="standard" {...defaultFullInputProps}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Name of Doctor
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={surrogateReport.doctorName}
                      onChange={(e) => {
                        setSurrogateReport({
                          ...surrogateReport,
                          doctorName: e.target.value,
                        });
                      }}
                      label="Name of Doctor"
                    >
                      {RecentParents.map((doctor, index) => {
                        return (
                          <MenuItem value={doctor.name} key={doctor.name}>
                            {doctor.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
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
                    value={surrogateReport.overview}
                    onChange={(e) =>
                      setSurrogateReport({
                        ...surrogateReport,
                        overview: e.target.value,
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
                    setCurrentFormSection(2);
                  }}
                >
                  Next Step &nbsp; <i className="far fa-long-arrow-alt-right" />
                </span>
              </div>
            </div>
          ) : (
            <div className="modal-form-container flex-column align-center width-100">
              <div className="modal-form flex-column align-center">
                <br />
                <span className="fw-600 poppins px-24">Report File</span>
                <br />
                <FormControl variant="standard" {...defaultFullInputProps}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Select Report Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={surrogateReport.reportType}
                    onChange={(e) => {
                      setSurrogateReport({
                        ...surrogateReport,
                        reportType: e.target.value,
                      });
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
                <br />
                <span className="flex-column align-center width-100">
                  <div className="flex-column modal-form-file-container">
                    <span className="px-13 poppins fw-500">
                      &nbsp; &nbsp; Upload Document
                    </span>
                    <div className="flex-row modal-form-file width-100">
                      <div className="px-13 poppins fw-500">
                        {surrogateReport.reportFile ? (
                          surrogateReport.reportFile.name
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
                      setCurrentFormSection(1);
                    }}
                  >
                    Back &nbsp; <i className="far fa-long-arrow-alt-left" />
                  </span>
                  <br />
                  <span
                    className="purple-btn-default px-16 poppins pointer width-100 uppercase modal-form-submit surrogate-form-btn"
                    onClick={() => CreateSurrogateProfile()}
                  >
                    Create Report &nbsp;{" "}
                    <i className="far fa-long-arrow-alt-right" />
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
