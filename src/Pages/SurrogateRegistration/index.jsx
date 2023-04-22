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
} from "../../Assets/Data";
export default function SurrogateRegistration({ showAddSurrogateModal }) {
  const [isModalOpen, setModalOpen] = useState(true);
  const [currentFormSection, setCurrentFormSection] = useState(1);
  const [surrogateForm, setSurrogateForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
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
    lastChildBirth: "",
    hivStatus: false,
    govtIdentificationFile: "",
    covidVaccinationFile: "",
    nextOfKin: {
      name: "",
      address: "",
      phone: "",
      relationship: "sibling",
      nationalIdentificationNumber: "",
    },
  });
  const primaryImageUploadRef = useRef();
  const secondaryImageUploadRef = useRef();
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

  return (
    <>
      <input
        type="file"
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
      <Modal
        open={isModalOpen}
        onClose={(e, reason) => {
          if (reason === "backdropClick") {
            setModalOpen(false);
            showAddSurrogateModal(false);
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
                    slotProps={{
                      textField: { variant: "standard" },
                    }}
                    value={surrogateForm.dateOfBirth}
                    onChange={(e) =>
                      setSurrogateForm({ ...surrogateForm, dateOfBirth: e })
                    }
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
                  <DatePicker
                    slotProps={{
                      textField: { variant: "standard" },
                    }}
                    value={surrogateForm.dateOfBirth}
                    onChange={(e) =>
                      setSurrogateForm({ ...surrogateForm, dateOfBirth: e })
                    }
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
                <span className="purple-btn-default px-16 poppins pointer width-100 uppercase modal-form-submit surrogate-form-btn">
                  Next Step &nbsp; <i className="far fa-long-arrow-alt-right" />
                </span>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
