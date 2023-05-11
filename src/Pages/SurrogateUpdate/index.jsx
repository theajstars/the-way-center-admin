import { useState, useRef, useEffect, useContext } from "react";

import {
  InputLabel,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
} from "@mui/material";
import { useToasts } from "react-toast-notifications";

import ImageSelectorPlaceholder from "../../Assets/IMG/ImageSelectorPlaceholder.svg";
import { DateField, DatePicker } from "@mui/x-date-pickers";
import {
  CountriesList,
  CovidVaccinationDosage,
  Diseases,
  initialSurrogate,
  NextOfKinRelationships,
} from "../../Assets/Data";
import dayjs from "dayjs";

import Confirmation from "../Confirmation";
import SurrogateReportCreate from "../SurrogateReportCreate";
import { UploadFile } from "../../API/FetchData";
import { validatePhone } from "../../Lib/Validate";
import { validateEmail } from "../../App";
import { PerformRequest } from "../../API/PerformRequests";
import { DefaultContext } from "../Dashboard";

export default function SurrogateUpdate({
  showUpdateSurrogateModal,
  surrogate,
}) {
  const [isModalOpen, setModalOpen] = useState(true);
  const { addToast, removeAllToasts } = useToasts();
  const ContextConsumer = useContext(DefaultContext);

  console.log(surrogate);
  const [currentFormSection, setCurrentFormSection] = useState(1);
  const [surrogateForm, setSurrogateForm] = useState(surrogate);
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
  const [showCreateReport, setShowCreateReport] = useState(false);
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
  const showSurrogateReportModal = (value) => {
    setShowCreateReport(value);
    setModalOpen(false);
    showUpdateSurrogateModal(false);
  };
  const fileIsLarge = () => {
    addToast("Max File Size: 1.5MB", { appearance: "error" });
  };
  const [imageUploading, setImageUploading] = useState(false);

  const UploadSurrogateImage = async (label, image) => {
    let imageFormData = new FormData();

    imageFormData.append(
      "file",
      image,
      image.name.toLowerCase().split(" ").join().replaceAll(",", "")
    );
    setImageUploading(true);
    const uploadImage = await UploadFile({
      formData: imageFormData,
    });
    console.log(uploadImage);
    setImageUploading(false);
    if (label === "Primary") {
      setSurrogateForm({
        ...surrogateForm,
        primary: {
          ...surrogateForm.primary,
          mainImage: uploadImage.data.fileUrl,
        },
      });
    } else {
      setSurrogateForm({
        ...surrogateForm,
        primary: {
          ...surrogateForm.primary,
          secondImage: uploadImage.data.fileUrl,
        },
      });
    }
  };
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({
    firstname: false,
    lastname: false,

    address: false,
    primaryPhone: false,
    primaryEmailAddress: false,
  });
  const UpdateFormErrors = () => {
    const isPrimaryPhoneValid = validatePhone(surrogateForm.primary.phone);

    const isPrimaryEmailValid = validateEmail(surrogateForm.primary.email);

    setFormErrors({
      ...formErrors,
      firstname: surrogateForm.primary.firstname.length === 0,
      lastname: surrogateForm.primary.lastname.length === 0,

      address: surrogateForm.address.length === 0,
      primaryEmailAddress: !isPrimaryEmailValid,

      primaryPhone: !isPrimaryPhoneValid,
    });
  };
  useEffect(() => {
    UpdateSurrogate();
  }, [formErrors]);
  const UpdateSurrogate = async () => {
    console.log(formErrors);
    if (formSubmitting) {
      const errors = Object.values(formErrors).filter((e) => e === true);
      if (errors.length > 0) {
        setFormSubmitting(false);

        addToast("Please fill the form correctly", { appearance: "error" });
      } else {
        const data = {
          surrogateID: surrogate.id,
          firstname: surrogateForm.primary.firstname,
          lastname: surrogateForm.primary.lastname,
          address: surrogateForm.primary.address,
          phone: surrogateForm.primary.phone,
          email: surrogateForm.primary.email,
          mainImage: surrogateForm.primary.mainImage,
          secondImage: surrogateForm.primary.secondImage,
        };
        const updateRequest = await PerformRequest.UpdateSurrogate(data).catch(
          () => {
            setFormSubmitting(false);
          }
        );
        console.log(updateRequest);
        const { message: responseMessage } = updateRequest.data;
        if (updateRequest.data.status === "failed") {
          addToast(responseMessage, { appearance: "error" });
        } else {
          addToast(responseMessage, { appearance: "success" });
          setShowConfirmationModal(true);
          showUpdateSurrogateModal(false);
          ContextConsumer.refetchData();
        }
      }
    }
  };
  return (
    <>
      {showConfirmationModal && (
        <Confirmation
          modalHeaderText=""
          modalBodyText="Profile Updated Successfully"
          modalAction={{
            method: () => {
              setShowConfirmationModal(false);
              setModalOpen(true);
              setSurrogateForm(initialSurrogate);
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
      {showCreateReport && (
        <SurrogateReportCreate
          showSurrogateReportModal={showSurrogateReportModal}
          surrogate={surrogate}
        />
      )}
      <>
        <input
          type="file"
          accept=".pdf, .jpg,  .png"
          ref={primaryImageUploadRef}
          className="modal-image-hide"
          onChange={(e) => {
            console.log(e.target.files);
            const image = e.target.files[0];
            if (image.size > 1547220) {
              fileIsLarge();
            } else {
              UploadSurrogateImage("Primary", image);
            }
          }}
        />
        <input
          type="file"
          accept=".pdf, .jpg,  .png"
          ref={secondaryImageUploadRef}
          className="modal-image-hide"
          onChange={(e) => {
            console.log(e.target.files);
            const image = e.target.files[0];
            if (image.size > 1547220) {
              fileIsLarge();
            } else {
              UploadSurrogateImage("Secondary", image);
            }
          }}
        />
        <input
          type="file"
          accept=".pdf, .jpg,  .png"
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
      </>

      <input
        type="file"
        accept=".pdf, .jpg,  .png"
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
            update surrogate profile
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
                    value={surrogateForm.primary.firstname}
                    error={formErrors.firstname}
                    {...defaultHalfInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        primary: {
                          ...surrogateForm.primary,
                          firstname: e.target.value,
                        },
                      })
                    }
                  />
                  <TextField
                    label="Last Name"
                    value={surrogateForm.primary.lastname}
                    error={formErrors.lastname}
                    {...defaultHalfInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        primary: {
                          ...surrogateForm.primary,
                          lastname: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                {/* <div className="flex-row space-between modal-input-row">
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
                </div> */}
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Address"
                    value={surrogateForm.address}
                    error={formErrors.address}
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
                    value={surrogateForm.primary.phone}
                    error={formErrors.primaryPhone}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        primary: {
                          ...surrogateForm.primary,
                          phone: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Primary Email Address"
                    value={surrogateForm.primary.email}
                    error={formErrors.primaryEmailAddress}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        primary: {
                          ...surrogateForm.primary,
                          email: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                {/* <div className="flex-row space-between modal-input-row">
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
                </div> */}
              </div>
              <div className="flex-column modal-form-right space-between">
                <span className="flex-column align-center width-100">
                  <div className="modal-form-image-container modal-form-image-container-small flex-row">
                    <img
                      src={surrogateForm.primary.mainImage}
                      alt=""
                      className="modal-form-image"
                    />
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
                    <img
                      src={surrogateForm.primary.secondImage}
                      alt=""
                      className="modal-form-image"
                    />
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
                <button
                  disabled={formSubmitting || imageUploading}
                  style={{
                    opacity: formSubmitting || imageUploading ? "0.5" : "1",
                  }}
                  className="purple-btn-default px-16 poppins pointer width-100 uppercase modal-form-submit surrogate-form-btn"
                  onClick={() => {
                    // setCurrentFormSection(2);
                    setFormSubmitting(true);
                    UpdateFormErrors();
                  }}
                >
                  Update &nbsp;
                  {formSubmitting || imageUploading ? (
                    <i className="far fa-spinner-third fa-spin" />
                  ) : (
                    <i className="far fa-long-arrow-alt-right" />
                  )}
                </button>
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
                    value={surrogateForm.primary.nok.fullname}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        primary: {
                          ...surrogateForm.primary,
                          nok: {
                            ...surrogateForm.primary.nok,
                            fullname: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Address"
                    value={surrogateForm.primary.nok.address}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        primary: {
                          ...surrogateForm.primary,
                          nok: {
                            ...surrogateForm.primary.nok,
                            address: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Next of Kin Phone Number"
                    value={surrogateForm.primary.nok.phone}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        primary: {
                          ...surrogateForm.primary,
                          nok: {
                            ...surrogateForm.primary.nok,
                            phone: e.target.value,
                          },
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
                      value={surrogateForm.primary.nok.relationship}
                      onChange={(e) =>
                        setSurrogateForm({
                          ...surrogateForm,
                          primary: {
                            ...surrogateForm.primary,
                            relationship: {
                              ...surrogateForm.primary.nok,
                              fullname: e.target.value,
                            },
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
                {/* <div className="flex-row space-between modal-input-row">
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
                </div> */}
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
          {/* <div className="flex-row width-100">
            <Button variant="contained" onClick={CreateSurrogateReport}>
              Create Report
            </Button>
          </div> */}
        </div>
      </Modal>
    </>
  );
}
