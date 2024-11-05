import { useState, useRef, useContext, useEffect } from "react";

import {
  InputLabel,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { DateField, DatePicker } from "@mui/x-date-pickers";
import { useToasts } from "react-toast-notifications";
import {
  CountriesList,
  CovidVaccinationDosage,
  Diseases,
  HairColours,
  SkinColours,
} from "../../Assets/Data";
import dayjs from "dayjs";

import Confirmation from "../Confirmation";
import { FetchData, UploadFile } from "../../API/FetchData";
import { Endpoints } from "../../API/Endpoints";
import { DefaultContext } from "../Dashboard";
import { validatePhone } from "../../Lib/Validate";
import { validateBVN, validateEmail, validateNIN } from "../../App";
import ImageSelectorPlaceholder from "../../Assets/IMG/ImageSelectorPlaceholder.svg";
import { PerformRequest } from "../../API/PerformRequests";

const initialSurrogateForm = {
  firstName: "",
  lastName: "",
  dateOfBirth: dayjs("2023-01-01"),
  placeOfBirth: "Nigeria",
  address: "",
  city: "",
  state: "",
  country: "",
  area: "",
  primaryPhone: "",
  primaryEmailAddress: "",
  bankVerificationNumber: "",
  nationalIdentificationNumber: "",
  primaryImage: undefined,
  secondaryImage: undefined,

  tribe: "",
  religion: "",
  experience: "",
  spouseFirstName: "",
  spouseLastName: "",
  secondaryEmailAddress: "",
  secondaryPhone: "",
  sibling: {
    fullname: "",
    relationship: "Brother",
    phone: "",
  },
  // Form Section B
  knownDisease: "None",
  covidVaccination: "0",
  firstTimeParent: "No",
  lastChildBirth: dayjs("2023-01-01"),
  hivStatus: "Negative",
  govtIdentificationFile: undefined,
  covidVaccinationFile: undefined,
  nextOfKin: {
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    area: "",
    phone: "",
    relationship: "Father",
    nationalIdentificationNumber: "",
  },
};

export default function SurrogateRegistration({ showAddSurrogateModal }) {
  const { addToast, removeAllToasts } = useToasts();

  const [isModalOpen, setModalOpen] = useState(true);
  const consumeContext = useContext(DefaultContext);

  const { Tribes, Religions } = consumeContext;
  console.log({ Tribes, Religions });
  const [countriesList, setCountriesList] = useState(CountriesList);

  const [currentFormSection, setCurrentFormSection] = useState(1);
  const [surrogateForm, setSurrogateForm] = useState(initialSurrogateForm);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    dateOfBirth: false,
    placeOfBirth: false,
    address: false,
    city: false,
    state: false,
    country: false,
    area: false,
    tribe: false,
    religion: false,
    experience: false,
    primaryPhone: false,
    primaryEmailAddress: false,
    bankVerificationNumber: false,
    nationalIdentificationNumber: false,
    primaryImage: false,
    secondaryImage: false,

    spouseFirstName: false,
    spouseLastName: false,
    secondaryEmailAddress: false,
    secondaryPhone: false,

    // Form Section B
    knownDisease: false,
    covidVaccination: false,
    firstTimeParent: false,
    lastChildBirth: false,
    hivStatus: false,
    govtIdentificationFile: false,
    covidVaccinationFile: false,
    nextOfKin_name: false,
    nextOfKin_phone: false,
    nextOfKin_address: false,
    nextOfKinCity: false,
    nextOfKinState: false,
    nextOfKinCountry: false,
    nextOfKinArea: false,
    nextOfKin_nationalIdentificationNumber: false,

    sibling_name: false,
    sibling_phone: false,
  });

  useEffect(() => {
    console.log("Fucking changed!", formSubmitting);
  }, [formSubmitting]);
  const primaryImageUploadRef = useRef();
  const secondaryImageUploadRef = useRef();

  const govtIdentificationUploadRef = useRef();
  const covidVaccinationUploadRef = useRef();
  const defaultFullInputProps = {
    variant: "standard",
    spellCheck: false,
    className: "modal-input-full px-12",
  };
  const defaultHalfInputProps = {
    variant: "standard",
    className: "modal-input-half px-12",
    spellCheck: false,
  };
  const fileIsLarge = () => {
    addToast("Max File Size: 1.5MB", { appearance: "error" });
  };
  const UpdateFormErrors = () => {
    const isPrimaryPhoneValid = validatePhone(surrogateForm.primaryPhone);
    const isEmailValid = validateEmail(surrogateForm.primaryEmailAddress);
    const is_BVN_Valid = validateBVN(surrogateForm.bankVerificationNumber);
    const is_NIN_Valid = validateNIN(
      surrogateForm.nationalIdentificationNumber
    );

    const isNexfOfKinPrimaryPhoneValid =
      validatePhone(surrogateForm.nextOfKin.phone) &&
      surrogateForm.primaryPhone !== surrogateForm.nextOfKin.phone &&
      surrogateForm.sibling.phone !== surrogateForm.nextOfKin.phone;
    const isSiblingPhoneValid =
      validatePhone(surrogateForm.sibling.phone) &&
      surrogateForm.primaryPhone !== surrogateForm.sibling.phone &&
      surrogateForm.sibling.phone !== surrogateForm.nextOfKin.phone;
    const isNexfOfKinNINValid = validateNIN(
      surrogateForm.nextOfKin.nationalIdentificationNumber
    );
    setFormErrors({
      ...formErrors,
      firstName: surrogateForm.firstName.length === 0,
      lastName: surrogateForm.lastName.length === 0,
      address: surrogateForm.address.length === 0,
      city: surrogateForm.city.length === 0,
      state: surrogateForm.state.length === 0,
      country: surrogateForm.country.length === 0,
      area: surrogateForm.area.length === 0,
      primaryPhone: !isPrimaryPhoneValid,
      primaryEmailAddress: !isEmailValid,
      bankVerificationNumber: !is_BVN_Valid,
      nationalIdentificationNumber: !is_NIN_Valid,

      tribe: surrogateForm.tribe.length === 0,
      religion: surrogateForm.religion.length === 0,
      experience: surrogateForm.experience.length === 0,

      sibling_phone: !isSiblingPhoneValid,
      sibling_name: surrogateForm.sibling.fullname.length === 0,

      nextOfKin_name: surrogateForm.nextOfKin.name.length === 0,
      nextOfKin_address: surrogateForm.nextOfKin.address.length === 0,
      nextOfKin_phone: !isNexfOfKinPrimaryPhoneValid,
      nextOfKin_nationalIdentificationNumber: !isNexfOfKinNINValid,

      primaryImage: !surrogateForm.primaryImage,
      secondaryImage: !surrogateForm.secondaryImage,

      govtIdentificationFile: !surrogateForm.govtIdentificationFile,
      covidVaccinationFile: !surrogateForm.covidVaccinationFile,
    });
    // console.log(formErrors);
  };

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    CreateSurrogateProfile();
    console.log(formErrors);
  }, [formErrors]);

  const CreateSurrogateProfile = async () => {
    const errors = Object.values(formErrors).filter((e) => e === true);
    if (errors.length > 0) {
      setFormSubmitting(false);

      addToast("Please fill the form correctly", { appearance: "error" });
    } else {
      // setFormSubmitting(false);
      let primaryImageFormData = new FormData();
      primaryImageFormData.append(
        "file",
        surrogateForm.primaryImage,
        surrogateForm.primaryImage.name
          .toLowerCase()
          .split(" ")
          .join()
          .replaceAll(",", "")
      );

      let secondaryImageFormData = new FormData();
      secondaryImageFormData.append(
        "file",
        surrogateForm.secondaryImage,
        surrogateForm.secondaryImage.name
          .toLowerCase()
          .split(" ")
          .join()
          .replaceAll(",", "")
      );

      let govtIDFormData = new FormData();
      govtIDFormData.append(
        "file",
        surrogateForm.govtIdentificationFile,
        surrogateForm.govtIdentificationFile.name
          .toLowerCase()
          .split(" ")
          .join()
          .replaceAll(",", "")
      );
      let covidVaccinationFormData = new FormData();
      covidVaccinationFormData.append(
        "file",
        surrogateForm.covidVaccinationFile,
        surrogateForm.covidVaccinationFile.name
          .toLowerCase()
          .split(" ")
          .join()
          .replaceAll(",", "")
      );

      const uploadPrimaryImage = await UploadFile({
        formData: primaryImageFormData,
      });
      const uploadSecondaryImage = await UploadFile({
        formData: secondaryImageFormData,
      });
      const uploadGovtId = await UploadFile({
        formData: govtIDFormData,
      });
      const uploadCovidVaccination = await UploadFile({
        formData: covidVaccinationFormData,
      });
      console.log(uploadCovidVaccination);
      const {
        name: nextOfKin_name,
        address: nextOfKin_address,
        city: nextOfKin_city,
        state: nextOfKin_state,
        country: nextOfKin_country,
        area: nextOfKin_area,
        phone: nextOfKin_phone,
        nationalIdentificationNumber: nextOfKin_nationalIdentificationNumber,
        relationship: nextOfKin_relationship,
      } = surrogateForm.nextOfKin;
      const data = {
        firstname: surrogateForm.firstName,
        lastname: surrogateForm.lastName,
        email: surrogateForm.primaryEmailAddress,
        phone: surrogateForm.primaryPhone,
        address: surrogateForm.address,
        city: surrogateForm.city,
        state: surrogateForm.state,
        country: surrogateForm.country,
        area: surrogateForm.area,
        dateOfBirth: dayjs(surrogateForm.dateOfBirth).format("YYYY-MM-DD"),
        tribe: surrogateForm.tribe,
        religion: surrogateForm.religion,
        experience: surrogateForm.experience,
        placeOfBirth: surrogateForm.placeOfBirth,
        mainImage: uploadPrimaryImage.data.fileUrl,
        secondImage: uploadSecondaryImage.data.fileUrl,
        nin: surrogateForm.nationalIdentificationNumber,
        bvn: surrogateForm.bankVerificationNumber,
        governmentID: uploadGovtId.data.fileUrl,

        nok: {
          fullname: nextOfKin_name,
          relationship: nextOfKin_relationship,
          address: nextOfKin_address,
          state: nextOfKin_state,
          area: nextOfKin_area,
          country: nextOfKin_country,
          city: nextOfKin_city,
          phone: nextOfKin_phone,
          nin: nextOfKin_nationalIdentificationNumber,
        },
        sibling: {
          fullname: surrogateForm.sibling.fullname,
          relationship: surrogateForm.sibling.relationship,
          phone: surrogateForm.sibling.phone,
        },

        extendedInfo: {
          disease: surrogateForm.knownDisease,
          covidVaccination: surrogateForm.covidVaccination,
          covidVaccinationCertificate: uploadCovidVaccination.data.fileUrl,
          firstTimeParent: surrogateForm.firstTimeParent,
          hivStatus: surrogateForm.hivStatus,
          lastChildBirthTime: dayjs(surrogateForm.lastChildBirth).format(
            "YYYY-MM-DD"
          ),
        },
      };

      console.log("Data: ", data);
      const createSurrogateRequest = await PerformRequest.CreateNewSurrogate(
        data
      ).catch(() => {
        setFormSubmitting(false);
      });
      setFormSubmitting(false);
      console.log(createSurrogateRequest);
      removeAllToasts();
      const { message: responseMessage } = createSurrogateRequest.data;
      if (createSurrogateRequest.data.status === "failed") {
        addToast(responseMessage, { appearance: "error" });
      } else {
        addToast(responseMessage, { appearance: "success" });
        window.location.reload();
      }
    }

    // setModalOpen(false);
    // setShowConfirmationModal(true);
  };
  const getConfirmationModalStatus = (value) => {
    setShowConfirmationModal(value);
    if (!value) {
      showAddSurrogateModal(false);
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
        accept=".jpg, .png"
        ref={primaryImageUploadRef}
        className="modal-image-hide"
        onChange={(e) => {
          const image = e.target.files[0];
          console.log(image);
          if (image.size > 1547220) {
            fileIsLarge();
          } else {
            setSurrogateForm({
              ...surrogateForm,
              primaryImage: image,
            });
          }
        }}
      />
      <input
        type="file"
        accept=".jpg, .png"
        ref={secondaryImageUploadRef}
        className="modal-image-hide"
        onChange={(e) => {
          console.log(e.target.files);
          const image = e.target.files[0];
          if (image.size > 1547220) {
            fileIsLarge();
          } else {
            setSurrogateForm({
              ...surrogateForm,
              secondaryImage: image,
            });
          }
        }}
      />
      <input
        type="file"
        accept=".pdf, .jpg, .png"
        ref={govtIdentificationUploadRef}
        className="modal-image-hide"
        onChange={(e) => {
          const file = e.target.files[0];
          console.log(file);
          if (file.size > 1547220) {
            fileIsLarge();
          } else {
            setSurrogateForm({
              ...surrogateForm,
              govtIdentificationFile: file,
            });
          }
        }}
      />
      <input
        type="file"
        accept=".pdf, .jpg, .png"
        ref={covidVaccinationUploadRef}
        className="modal-image-hide"
        onChange={(e) => {
          console.log(e.target.files);
          const file = e.target.files[0];
          if (file.size > 1547220) {
            fileIsLarge();
          } else {
            setSurrogateForm({
              ...surrogateForm,
              covidVaccinationFile: file,
            });
          }
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
          <span className="modal-about poppins px-13">
            Fill in the data for surrogate profile correctly. It will take a
            couple of minutes
          </span>

          {currentFormSection === 1 ? (
            <div className="modal-form-container flex-row">
              <div className="modal-form flex-column">
                <br />
                <span className="fw-600 poppins px-21">Surrogate Bio-Data</span>
                <br />
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="First Name"
                    value={surrogateForm.firstName}
                    error={formErrors.firstName}
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
                    error={formErrors.lastName}
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
                    value={dayjs(surrogateForm.dateOfBirth)}
                    onChange={(e) => {
                      setSurrogateForm({
                        ...surrogateForm,
                        dateOfBirth: dayjs(e).format("YYYY-MM-DD"),
                      });
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
                      {countriesList.map((country, index) => {
                        return (
                          <MenuItem value={country.name} key={country.name}>
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
                    label="City"
                    value={surrogateForm.city}
                    error={formErrors.city}
                    {...defaultHalfInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        city: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="State"
                    value={surrogateForm.state}
                    error={formErrors.state}
                    {...defaultHalfInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        state: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <FormControl {...defaultHalfInputProps}>
                    <InputLabel
                      variant="standard"
                      htmlFor="uncontrolled-native"
                    >
                      Country
                    </InputLabel>
                    <Select
                      label="Country"
                      placeholder="Select country"
                      value={surrogateForm.country}
                      error={formErrors.country}
                      onChange={(e) =>
                        setSurrogateForm({
                          ...surrogateForm,
                          country: e.target.value,
                        })
                      }
                    >
                      {CountriesList.map((country, index) => {
                        return (
                          <MenuItem
                            value={country.name}
                            key={`${country.iso_alpha2}-${country.iso_alpha3}`}
                          >
                            {country.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Area"
                    value={surrogateForm.area}
                    error={formErrors.area}
                    {...defaultHalfInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        area: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Experience"
                    value={surrogateForm.experience}
                    error={formErrors.experience}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        experience: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Primary Phone Number"
                    placeholder="0802-345-6789"
                    value={surrogateForm.primaryPhone}
                    error={formErrors.primaryPhone}
                    {...defaultFullInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        primaryPhone: e.target.value,
                      })
                    }
                    // onBlur={() => {
                    //   setSurrogateForm({
                    //     ...surrogateForm,
                    //     primaryPhone: surrogateForm.primaryPhone.replace(
                    //       "+",
                    //       ""
                    //     ),
                    //   });
                    // }}
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Primary Email Address"
                    value={surrogateForm.primaryEmailAddress}
                    error={formErrors.primaryEmailAddress}
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
                    inputProps={{
                      maxLength: 11,
                    }}
                    label="Bank Verification Number"
                    value={surrogateForm.bankVerificationNumber}
                    error={formErrors.bankVerificationNumber}
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
                    inputProps={{
                      maxLength: 11,
                    }}
                    value={surrogateForm.nationalIdentificationNumber}
                    error={formErrors.nationalIdentificationNumber}
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
                    {surrogateForm.primaryImage ? (
                      <img
                        src={URL.createObjectURL(surrogateForm.primaryImage)}
                        alt=""
                        className="modal-form-image"
                      />
                    ) : (
                      <span className="px-14 poppins">No Image Selected</span>
                    )}
                  </div>
                  <br />
                  <span
                    className="purple-btn-default px-14 poppins pointer width-100 surrogate-form-btn"
                    onClick={() => {
                      primaryImageUploadRef.current.click();
                    }}
                    style={{
                      borderColor: formErrors.primaryImage
                        ? "red"
                        : "transparent",
                    }}
                  >
                    Upload Main Image
                  </span>
                  <br />
                  <div className="modal-form-image-container modal-form-image-container-small flex-row">
                    {surrogateForm.secondaryImage ? (
                      <img
                        src={URL.createObjectURL(surrogateForm.secondaryImage)}
                        alt=""
                        className="modal-form-image"
                      />
                    ) : (
                      <span className="px-14 poppins">No Image Selected</span>
                    )}
                  </div>
                  <br />
                  <span
                    className="purple-btn-default px-14 poppins pointer width-100 surrogate-form-btn"
                    onClick={() => {
                      secondaryImageUploadRef.current.click();
                    }}
                    style={{
                      borderColor: formErrors.secondaryImage
                        ? "red"
                        : "transparent",
                    }}
                  >
                    Upload Second Image
                  </span>
                </span>
                <br />
                <span
                  className="purple-btn-default px-14 poppins pointer width-100 uppercase modal-form-submit surrogate-form-btn"
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
                <span className="fw-600 poppins px-21">
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
                    defaultValue={dayjs("2023-01-01")}
                    {...defaultFullInputProps}
                    slotProps={{
                      textField: { variant: "standard" },
                    }}
                    value={dayjs(surrogateForm.lastChildBirth)}
                    onChange={(e) => {
                      setSurrogateForm({
                        ...surrogateForm,
                        lastChildBirth: dayjs(e).format("YYYY-MM-DD"),
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
                      value={surrogateForm.hivStatus}
                      onChange={(e) => {
                        setSurrogateForm({
                          ...surrogateForm,
                          hivStatus: e.target.value,
                        });
                      }}
                      label="HIV/AIDS STATUS"
                    >
                      <MenuItem value={"Negative"} key="hiv-status-false">
                        Negative
                      </MenuItem>
                      <MenuItem value={"Positive"} key="hiv-status-true">
                        Positive
                      </MenuItem>
                    </Select>
                  </FormControl>
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
                      <MenuItem value={"No"} key="first-time-parent-false">
                        No
                      </MenuItem>
                      <MenuItem value={"Yes"} key="first-time-parent-true">
                        Yes
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="flex-row space-between modal-input-row">
                  <FormControl variant="standard" {...defaultHalfInputProps}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Tribe
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={surrogateForm.tribe}
                      error={formErrors.tribe}
                      onChange={(e) => {
                        setSurrogateForm({
                          ...surrogateForm,
                          tribe: e.target.value,
                        });
                      }}
                      label="Tribe"
                    >
                      {Tribes.map((tribe) => {
                        return (
                          <MenuItem value={tribe.tribe} key="hiv-status-false">
                            {tribe.tribe}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <FormControl variant="standard" {...defaultHalfInputProps}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Religion
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={surrogateForm.religion}
                      error={formErrors.religion}
                      onChange={(e) => {
                        setSurrogateForm({
                          ...surrogateForm,
                          religion: e.target.value,
                        });
                      }}
                      label="Religion"
                    >
                      {Religions.map((rel) => {
                        return (
                          <MenuItem value={rel.tribe} key="hiv-status-false">
                            {rel.tribe}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Sibling Full Name"
                    {...defaultFullInputProps}
                    value={surrogateForm.sibling.fullname}
                    error={formErrors.sibling_name}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        sibling: {
                          ...surrogateForm.sibling,
                          fullname: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <FormControl variant="standard" {...defaultHalfInputProps}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Relationship to Sibling
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={surrogateForm.sibling.relationship}
                      {...defaultFullInputProps}
                      onChange={(e) =>
                        setSurrogateForm({
                          ...surrogateForm,
                          sibling: {
                            ...surrogateForm.sibling,
                            relationship: e.target.value,
                          },
                        })
                      }
                      label="Relationship to Sibling"
                    >
                      <MenuItem value={"Brother"} key="hiv-status-false">
                        Brother
                      </MenuItem>
                      <MenuItem value={"Sister"} key="hiv-status-false">
                        Sister
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Sibling Phone"
                    {...defaultHalfInputProps}
                    value={surrogateForm.sibling.phone}
                    error={formErrors.sibling_phone}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        sibling: {
                          ...surrogateForm.sibling,
                          phone: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Next of Kin Full Name"
                    value={surrogateForm.nextOfKin.name}
                    error={formErrors.nextOfKin_name}
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
                    error={formErrors.nextOfKin_address}
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
                    label="City"
                    value={surrogateForm.nextOfKin.city}
                    error={formErrors.nextOfKinCity}
                    {...defaultHalfInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        nextOfKin: {
                          ...surrogateForm.nextOfKin,
                          city: e.target.value,
                        },
                      })
                    }
                  />
                  <TextField
                    label="State"
                    value={surrogateForm.nextOfKin.state}
                    error={formErrors.nextOfKinState}
                    {...defaultHalfInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        nextOfKin: {
                          ...surrogateForm.nextOfKin,
                          state: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <FormControl {...defaultHalfInputProps}>
                    <InputLabel
                      variant="standard"
                      htmlFor="uncontrolled-native"
                    >
                      Country
                    </InputLabel>
                    <Select
                      label="Country"
                      placeholder="Select country"
                      value={surrogateForm.nextOfKin.country}
                      error={formErrors.nextOfKinCountry}
                      onChange={(e) =>
                        setSurrogateForm({
                          ...surrogateForm,
                          nextOfKin: {
                            ...surrogateForm.nextOfKin,
                            country: e.target.value,
                          },
                        })
                      }
                    >
                      {CountriesList.map((country, index) => {
                        return (
                          <MenuItem
                            value={country.name}
                            key={`${country.iso_alpha2}-${country.iso_alpha3}`}
                          >
                            {country.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Area"
                    value={surrogateForm.nextOfKin.area}
                    error={formErrors.nextOfKinArea}
                    {...defaultHalfInputProps}
                    onChange={(e) =>
                      setSurrogateForm({
                        ...surrogateForm,
                        nextOfKin: {
                          ...surrogateForm.nextOfKin,
                          area: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    label="Next of Kin Phone Number"
                    placeholder="0802-345-6789"
                    value={surrogateForm.nextOfKin.phone}
                    error={formErrors.nextOfKin_phone}
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
                    // onBlur={() => {
                    //   setSurrogateForm({
                    //     ...surrogateForm,
                    //     nextOfKin: {
                    //       ...surrogateForm.nextOfKin,
                    //       phone: surrogateForm.nextOfKin.phone.replace("+", ""),
                    //     },
                    //   });
                    // }}
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
                      label="Relationship to Kin"
                    >
                      {consumeContext.Relationships.map((rel, index) => {
                        return (
                          <MenuItem value={rel.relationship} key={index}>
                            {rel.relationship}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
                <div className="flex-row space-between modal-input-row">
                  <TextField
                    inputProps={{
                      maxLength: 11,
                    }}
                    label="National Identification Number"
                    value={surrogateForm.nextOfKin.nationalIdentificationNumber}
                    error={formErrors.nextOfKin_nationalIdentificationNumber}
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
                        style={{
                          borderColor: formErrors.govtIdentificationFile
                            ? "red"
                            : "transparent",
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
                        style={{
                          borderColor: formErrors.covidVaccinationFile
                            ? "red"
                            : "transparent",
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
                    className="purple-btn-default px-14 poppins pointer width-100 uppercase modal-form-submit surrogate-form-btn"
                    onClick={() => {
                      setCurrentFormSection(1);
                    }}
                  >
                    Back &nbsp; <i className="far fa-long-arrow-alt-left" />
                  </span>
                  <br />
                  <button
                    disabled={formSubmitting}
                    className="purple-btn-default px-14 poppins pointer width-100 uppercase modal-form-submit surrogate-form-btn"
                    onClick={() => {
                      UpdateFormErrors();
                      setFormSubmitting(true);
                    }}
                  >
                    Create Profile &nbsp;{" "}
                    {formSubmitting ? (
                      <i className="far fa-spinner-third fa-spin" />
                    ) : (
                      <i className="far fa-long-arrow-alt-right" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
