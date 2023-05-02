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

const initialSurrogateForm = {
  parent: "",
  surrogate: "",
  categoryOfReport: "",
  doctorName: "",
  nextAppointmentDate: dayjs("2023-01-01"),
  overview: "",
  reportFile: "",
  reportType: "",
};
export default function SurrogateReportCreate({ showSurrogateReportModal }) {
  const [isModalOpen, setModalOpen] = useState(true);

  const [currentFormSection, setCurrentFormSection] = useState(1);
  const [surrogateReport, setSurrogateReport] = useState(initialSurrogateForm);
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
  };
  const getConfirmationModalStatus = (value) => {
    setShowConfirmationModal(value);
    if (!value) {
      showSurrogateReportModal(false);
    }
  };
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
              setSurrogateReport(initialSurrogateForm);
              setCurrentFormSection(1);
            },
            text: "Create Another Profile",
          }}
          modalLink={{
            text: "Back to Dashboard",
            route: "/dashboard",
          }}
          getConfirmationModalStatus={getConfirmationModalStatus}
        />
      )}
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
            reportFile: URL.createObjectURL(image),
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
            <div className="modal-form-container flex-row">
              <div className="modal-form flex-column">
                <br />
                <span className="fw-600 poppins px-24">
                  Surrogate Health Information
                </span>
                <br />
                <div className="flex-row space-between modal-input-row">
                  <FormControl variant="standard" {...defaultHalfInputProps}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Any Known Disease/Ailment
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={surrogateReport.knownDisease}
                      onChange={(e) => {
                        setSurrogateReport({
                          ...surrogateReport,
                          knownDisease: e.target.value,
                        });
                      }}
                      label="Any Known Disease/Ailment"
                    >
                      {Diseases.map((disease, index) => {
                        return (
                          <MenuItem value={disease.value} key={disease.value}>
                            {disease.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <FormControl variant="standard" {...defaultHalfInputProps}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Taken COVID Vaccination
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={surrogateReport.covidVaccination}
                      onChange={(e) => {
                        setSurrogateReport({
                          ...surrogateReport,
                          covidVaccination: e.target.value,
                        });
                      }}
                      label="Taken Covid Vaccination"
                    >
                      {CovidVaccinationDosage.map((vaccination, index) => {
                        return (
                          <MenuItem
                            value={vaccination.value}
                            key={vaccination.value}
                          >
                            {vaccination.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
                <div className="flex-row space-between modal-input-row">
                  <FormControl variant="standard" {...defaultHalfInputProps}>
                    <InputLabel id="demo-simple-select-standard-label">
                      First Time Parent?
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={surrogateReport.firstTimeParent}
                      onChange={(e) => {
                        setSurrogateReport({
                          ...surrogateReport,
                          firstTimeParent: e.target.value,
                        });
                      }}
                      label="First Time Parent?"
                    >
                      <MenuItem value={false} key="first-time-parent-false">
                        No
                      </MenuItem>
                      <MenuItem value={true} key="first-time-parent-true">
                        Yes
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <DatePicker
                    defaultValue={dayjs("2023-01-01")}
                    {...defaultHalfInputProps}
                    slotProps={{
                      textField: { variant: "standard" },
                    }}
                    value={surrogateReport.lastChildBirth}
                    onChange={(e) => {
                      console.log(e);
                      console.log(dayjs(e).toDate());
                      setSurrogateReport({
                        ...surrogateReport,
                        lastChildBirth: e,
                      });
                    }}
                    label="Date of Last Child Birth"
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <FormControl variant="standard" {...defaultHalfInputProps}>
                    <InputLabel id="demo-simple-select-standard-label">
                      HIV/AIDS STATUS
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={surrogateReport.hivStatus}
                      onChange={(e) => {
                        setSurrogateReport({
                          ...surrogateReport,
                          hivStatus: e.target.value,
                        });
                      }}
                      label="HIV/AIDS STATUS"
                    >
                      <MenuItem value={false} key="hiv-status-false">
                        Negative
                      </MenuItem>
                      <MenuItem value={true} key="hiv-status-true">
                        Positive
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <DatePicker
                    defaultValue={dayjs("2023-01-01")}
                    {...defaultHalfInputProps}
                    slotProps={{
                      textField: { variant: "standard" },
                    }}
                    value={surrogateReport.lastChildBirth}
                    onChange={(e) =>
                      setSurrogateReport({
                        ...surrogateReport,
                        lastChildBirth: e,
                      })
                    }
                    label="Date of Last Child Birth"
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Next of Kin Full Name"
                    value={surrogateReport.nextOfKin.name}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setSurrogateReport({
                        ...surrogateReport,
                        nextOfKin: {
                          ...surrogateReport.nextOfKin,
                          name: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Address"
                    value={surrogateReport.nextOfKin.address}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setSurrogateReport({
                        ...surrogateReport,
                        nextOfKin: {
                          ...surrogateReport.nextOfKin,
                          address: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Next of Kin Phone Number"
                    value={surrogateReport.nextOfKin.phone}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setSurrogateReport({
                        ...surrogateReport,
                        nextOfKin: {
                          ...surrogateReport.nextOfKin,
                          phone: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <FormControl variant="standard" {...defaultFullInputProps}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Relationship to Kin
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={surrogateReport.nextOfKin.relationship}
                      onChange={(e) =>
                        setSurrogateReport({
                          ...surrogateReport,
                          nextOfKin: {
                            ...surrogateReport.nextOfKin,
                            relationship: e.target.value,
                          },
                        })
                      }
                      label="HIV/AIDS STATUS"
                    >
                      {NextOfKinRelationships.map((rel, index) => {
                        return (
                          <MenuItem value={rel.value} key={index}>
                            {rel.title}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="National Identification Number"
                    value={
                      surrogateReport.nextOfKin.nationalIdentificationNumber
                    }
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setSurrogateReport({
                        ...surrogateReport,
                        nextOfKin: {
                          ...surrogateReport.nextOfKin,
                          nationalIdentificationNumber: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex-column modal-form-right space-between">
                <span className="flex-column align-center width-100">
                  <div className="flex-column modal-form-file-container">
                    <span className="px-13 poppins fw-500">
                      &nbsp; &nbsp; Upload Government ID Card
                    </span>
                    <div className="flex-row modal-form-file width-100">
                      <div className="px-13 poppins fw-500">
                        {surrogateReport.govtIdentificationFile ? (
                          surrogateReport.govtIdentificationFile.name
                        ) : (
                          <span>No File Selected</span>
                        )}
                      </div>
                      <span
                        className="px-13 poppins fw-500 modal-form-file-btn flex-row pointer"
                        onClick={() => {
                          govtIdentificationUploadRef.current.click();
                        }}
                      >
                        Upload File
                      </span>
                    </div>
                    <span className="px-13 poppins fw-500 modal-form-file-about">
                      &nbsp; &nbsp; Acceptable format :PDF/JPG/PNG
                    </span>
                  </div>
                  <div className="flex-column modal-form-file-container">
                    <span className="px-13 poppins fw-500">
                      &nbsp; &nbsp; Upload COVID Vaccination
                    </span>
                    <div className="flex-row modal-form-file width-100">
                      <div className="px-13 poppins fw-500">
                        {surrogateReport.covidVaccinationFile ? (
                          surrogateReport.covidVaccinationFile.name
                        ) : (
                          <span>No File Selected</span>
                        )}
                      </div>
                      <span
                        className="px-13 poppins fw-500 modal-form-file-btn flex-row pointer"
                        onClick={() => {
                          covidVaccinationUploadRef.current.click();
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
                <br />
                <div className="width-100 flex-column">
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
                    Create Profile &nbsp;{" "}
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
