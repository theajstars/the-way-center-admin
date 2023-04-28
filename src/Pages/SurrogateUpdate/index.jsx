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
} from "../../Assets/Data";
import dayjs from "dayjs";

import Confirmation from "../Confirmation";

const initialSurrogateForm = {
  firstName: "",
  lastName: "",
  dateOfBirth: dayjs("2023-01-01"),
  placeOfBirth: "",
  address: "",
  primaryPhone: "",
  primaryEmailAddress: "",
  bankVerificationNumber: "",
  nationalIdentificationNumber: "",
  primaryImage: "",
  secondaryImage: "",

  spouseFirstName: "",
  spouseLastName: "",
  secondaryEmailAddress: "",
  secondaryPhone: "",
  image: "",

  // Form Section B
  knownDisease: "",
  covidVaccination: 0,
  firstTimeParent: false,
  lastChildBirth: dayjs("2023-01-01"),
  hivStatus: false,
  govtIdentificationFile: undefined,
  covidVaccinationFile: undefined,
  nextOfKin: {
    name: "",
    address: "",
    phone: "",
    relationship: "sibling",
    nationalIdentificationNumber: "",
  },
};
export default function SurrogateUpdate({ showUpdateSurrogateModal }) {
  const [isModalOpen, setModalOpen] = useState(true);

  const [currentFormSection, setCurrentFormSection] = useState(1);
  const [surrogateForm, setSurrogateForm] = useState(initialSurrogateForm);
  const primaryImageUploadRef = useRef();
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

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const CreateSurrogateProfile = () => {
    setModalOpen(false);
    setShowConfirmationModal(true);
  };
  const getConfirmationModalStatus = (value) => {
    setShowConfirmationModal(value);
    if (!value) {
      showUpdateSurrogateModal(false);
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
              setSurrogateForm(initialSurrogateForm);
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
        ref={primaryImageUploadRef}
        className="modal-image-hide"
        onChange={(e) => {
          console.log(e.target.files);
          const image = e.target.files[0];
          setSurrogateForm({
            ...surrogateForm,
            primaryImage: URL.createObjectURL(image),
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
          setSurrogateForm({
            ...surrogateForm,
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
          setSurrogateForm({
            ...surrogateForm,
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
          setSurrogateForm({
            ...surrogateForm,
            covidVaccinationFile: file,
          });
        }}
      />
      <Modal
        open={isModalOpen}
        onClose={(e, reason) => {
          if (reason === "backdropClick") {
            setModalOpen(false);
            showUpdateSurrogateModal(false);
          }
        }}
        className="default-modal-container flex-row"
      >
        <div className="default-modal-content modal-scrollbar surrogate-report-modal flex-column">
          <span className="cinzel px-30 uppercase">
            create surrogate profile
          </span>
          <br />
          <span className="modal-about poppins px-15">
            Fill in the data for surrogate profile correctly. It will take a
            couple of minutes
          </span>

          {currentFormSection === 1 ? (
            <div className="modal-form-container flex-row">
              <div className="modal-form flex-column">
                <br />
                <span className="fw-600 poppins px-24">Surrogate Bio-Data</span>
                <br />
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="First Name"
                    value={surrogateForm.firstName}
                    {...defaultHalfInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        firstName: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="Last Name"
                    value={surrogateForm.lastName}
                    {...defaultHalfInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        lastName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <DatePicker
                    defaultValue={dayjs("2023-01-01")}
                    {...defaultHalfInputProps}
                    slotProps={{
                      textField: { variant: "standard" },
                    }}
                    value={surrogateForm.dateOfBirth}
                    onChange={(e) => {
                      setSurrogateForm({ ...surrogateForm, dateOfBirth: e });
                    }}
                    label="Date of Birth"
                  />
                  <FormControl variant="standard" {...defaultHalfInputProps}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Place of Birth
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={surrogateForm.placeOfBirth}
                      onChange={(e) => {
                        setSurrogateForm({
                          ...surrogateForm,
                          placeOfBirth: e.target.value,
                        });
                      }}
                      label="Place of Birth"
                    >
                      {CountriesList.map((country, index) => {
                        return (
                          <MenuItem value={country.code3} key={country.code3}>
                            {country.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Address"
                    value={surrogateForm.address}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Primary Phone Number"
                    value={surrogateForm.primaryPhone}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        primaryPhone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Primary Email Address"
                    value={surrogateForm.primaryEmailAddress}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        primaryEmailAddress: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Bank Verification Number"
                    value={surrogateForm.bankVerificationNumber}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        bankVerificationNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="National Identification Number"
                    value={surrogateForm.nationalIdentificationNumber}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        nationalIdentificationNumber: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex-column modal-form-right space-between">
                <span className="flex-column align-center width-100">
                  <div className="modal-form-image-container modal-form-image-container-small flex-row">
                    {surrogateForm.primaryImage.length > 0 ? (
                      // Image is set

                      <img
                        src={surrogateForm.primaryImage}
                        alt=""
                        className="modal-form-image"
                      />
                    ) : (
                      // <img
                      //   src={ImageSelectorPlaceholder}
                      //   alt=""
                      //   className="modal-form-image"
                      // />
                      <span className="px-16 poppins">No Image Selected</span>
                    )}
                  </div>
                  <br />
                  <span
                    className="purple-btn-default px-16 poppins pointer width-100 surrogate-form-btn"
                    onClick={() => {
                      primaryImageUploadRef.current.click();
                    }}
                  >
                    Upload Main Image
                  </span>
                  <br />
                  <div className="modal-form-image-container modal-form-image-container-small flex-row">
                    {surrogateForm.secondaryImage.length > 0 ? (
                      // Image is set

                      <img
                        src={surrogateForm.secondaryImage}
                        alt=""
                        className="modal-form-image"
                      />
                    ) : (
                      // <img
                      //   src={ImageSelectorPlaceholder}
                      //   alt=""
                      //   className="modal-form-image"
                      // />
                      <span className="px-16 poppins">No Image Selected</span>
                    )}
                  </div>
                  <br />
                  <span
                    className="purple-btn-default px-16 poppins pointer width-100 surrogate-form-btn"
                    onClick={() => {
                      secondaryImageUploadRef.current.click();
                    }}
                  >
                    Upload Second Image
                  </span>
                </span>
                <br />
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
                      value={surrogateForm.knownDisease}
                      onChange={(e) => {
                        setSurrogateForm({
                          ...surrogateForm,
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
                      value={surrogateForm.covidVaccination}
                      onChange={(e) => {
                        setSurrogateForm({
                          ...surrogateForm,
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
                      value={surrogateForm.firstTimeParent}
                      onChange={(e) => {
                        setSurrogateForm({
                          ...surrogateForm,
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
                    value={surrogateForm.lastChildBirth}
                    onChange={(e) => {
                      console.log(e);
                      console.log(dayjs(e).toDate());
                      setSurrogateForm({ ...surrogateForm, lastChildBirth: e });
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
                      value={surrogateForm.hivStatus}
                      onChange={(e) => {
                        setSurrogateForm({
                          ...surrogateForm,
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
                    value={surrogateForm.lastChildBirth}
                    onChange={(e) =>
                      setSurrogateForm({ ...surrogateForm, lastChildBirth: e })
                    }
                    label="Date of Last Child Birth"
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Next of Kin Full Name"
                    value={surrogateForm.nextOfKin.name}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        nextOfKin: {
                          ...surrogateForm.nextOfKin,
                          name: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Address"
                    value={surrogateForm.nextOfKin.address}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        nextOfKin: {
                          ...surrogateForm.nextOfKin,
                          address: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Next of Kin Phone Number"
                    value={surrogateForm.nextOfKin.phone}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        nextOfKin: {
                          ...surrogateForm.nextOfKin,
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
                      value={surrogateForm.nextOfKin.relationship}
                      onChange={(e) =>
                        setSurrogateForm({
                          ...surrogateForm,
                          nextOfKin: {
                            ...surrogateForm.nextOfKin,
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
                    value={surrogateForm.nextOfKin.nationalIdentificationNumber}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        nextOfKin: {
                          ...surrogateForm.nextOfKin,
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
                        {surrogateForm.govtIdentificationFile ? (
                          surrogateForm.govtIdentificationFile.name
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
                        {surrogateForm.covidVaccinationFile ? (
                          surrogateForm.covidVaccinationFile.name
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
