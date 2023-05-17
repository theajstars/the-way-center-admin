import { useState, useRef, useEffect, useContext } from "react";

import { useParams, useNavigate } from "react-router-dom";
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
import { DatePicker } from "@mui/x-date-pickers";
import {
  CountriesList,
  CovidVaccinationDosage,
  Diseases,
  initialSurrogate,
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
  // surrogate,
}) {
  const ContextConsumer = useContext(DefaultContext);
  const { Tribes, Religions } = ContextConsumer;
  const navigate = useNavigate();
  const params = useParams();
  const { addToast, removeAllToasts } = useToasts();

  const [surrogateForm, setSurrogateForm] = useState(initialSurrogate);
  const [surrogateFormExtendedInfo, setSurrogateFormExtendedInfo] = useState(
    initialSurrogate.extendedInfo
  );
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

  const getConfirmationModalStatus = (value) => {
    setShowConfirmationModal(value);
    if (!value) {
      showUpdateSurrogateModal(false);
    }
  };

  const fileIsLarge = () => {
    addToast("Max File Size: 1.5MB", { appearance: "error" });
  };
  const [imageUploading, setImageUploading] = useState(false);

  const getFileName = (fileString) => {
    if (!fileString || fileString.length === 0) {
      return "No File Found";
    } else {
      let url = new URL(fileString);
      const lastIndex = url.pathname.lastIndexOf("/");
      const name = url.pathname.substring(lastIndex).replaceAll("/", "");
      if (name.length > 20) {
        return name.substring(name.length, name.length - 20);
      } else {
        return name;
      }
    }
  };
  const checkOrUploadFile = async (isFile, prevFile) => {
    if (!isFile) {
      return prevFile;
    } else {
      let fileFormData = new FormData();
      fileFormData.append(
        "file",
        isFile,
        isFile.name.toLowerCase().split(" ").join().replaceAll(",", "")
      );
      const uploadFile = await UploadFile({
        formData: fileFormData,
      });
      return uploadFile.data.fileUrl;
    }
  };
  const UploadSurrogateFile = async (label, file) => {
    let fileFormData = new FormData();

    fileFormData.append(
      "file",
      file,
      file.name.toLowerCase().split(" ").join().replaceAll(",", "")
    );
    setImageUploading(true);
    const uploadFile = await UploadFile({
      formData: fileFormData,
    });
    console.log(uploadFile);
    setImageUploading(false);
    if (label === "Primary") {
      setSurrogateForm({
        ...surrogateForm,
        primary: {
          ...surrogateForm.primary,
          mainImage: uploadFile.data.fileUrl,
        },
      });
    }
    if (label === "Secondary") {
      setSurrogateForm({
        ...surrogateForm,
        primary: {
          ...surrogateForm.primary,
          secondImage: uploadFile.data.fileUrl,
        },
      });
    }
    if (label === "Government") {
      setSurrogateForm({
        ...surrogateForm,
        primary: {
          ...surrogateForm.primary,
          governmentID: uploadFile.data.fileUrl,
        },
      });
    }
    if (label === "Covid") {
      setExtendedInfoValue(
        "covidVaccinationCertificate",
        uploadFile.data.fileUrl
      );
    }
  };

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({
    firstname: false,
    lastname: false,
    email: false,
    phone: false,
    address: false,
    dateOfBirth: false,
    tribe: false,
    religion: false,
    experience: false,
    placeOfBirth: false,
    mainImage: false,
    secondImage: false,
    nin: false,
    bvn: false,
    governmentID: false,
    nokFullname: false,
    nokRelationship: false,
    nokAddress: false,
    nokPhone: false,
    nokNin: false,
    status: false,
    disease: false,
    firstTimeParent: false,
    hivStatus: false,
    lastChildBirthTime: false,
    covidVaccination: false,
    covidVaccinationCertificate: false,
  });
  const UpdateFormErrors = () => {
    const isPhoneValid = validatePhone(surrogateForm.primary.phone);
    const isNokPhoneValid = validatePhone(surrogateForm.primary.nok.phone);

    const isEmailValid = validateEmail(surrogateForm.primary.email);

    setFormErrors({
      ...formErrors,
      firstname: surrogateForm.primary.firstname.length === 0,
      lastname: surrogateForm.primary.lastname.length === 0,

      religion: surrogateForm.primary.religion.length === 0,
      tribe: surrogateForm.primary.tribe.length === 0,
      // dateOfBirth: surrogateForm.dateOfBirth.length === 0,

      address: surrogateForm.address.length === 0,
      phone: !isPhoneValid,
      email: !isEmailValid,

      nin: surrogateForm.primary.nin.length !== 11,
      bvn: surrogateForm.primary.nin.length !== 11,

      disease: getExtendedInfoValue("disease").length === 0,
      covidVaccination: getExtendedInfoValue("covidVaccination").length === 0,
      firstTimeParent: getExtendedInfoValue("firstTimeParent").length === 0,
      lastChildBirthTime:
        getExtendedInfoValue("lastChildBirthTime").length === 0,
      hivStatus: getExtendedInfoValue("hivStatus").length === 0,

      nokFullname: surrogateForm.primary.nok.fullname.length === 0,
      nokAddress: surrogateForm.primary.nok.address.length === 0,
      nokPhone: surrogateForm.primary.nok.phone.length === 0,
      nokNin: surrogateForm.primary.nok.nin.length === 0,

      nokRelationship: surrogateForm.primary.nok.relationship.length === 0,
      status: surrogateForm.status.length === 0,
      experience: surrogateForm.primary.experience.length === 0,
    });
  };
  useEffect(() => {
    UpdateSurrogate();
  }, [formErrors]);
  const [surrogateLoading, setSurrogateLoading] = useState(false);

  const fetchSurrogate = async () => {
    setSurrogateLoading(true);
    const { surrogateID } = params;
    const r = await PerformRequest.GetAllSurrogates({ surrogateID }).catch(
      () => {
        setSurrogateLoading(false);
      }
    );
    setSurrogateLoading(false);
    console.log(r);
    if (r.data.status === "success" && r.data.data) {
      console.log("Surrogate Found");
      setSurrogateForm(r.data.data[0]);
      setSurrogateFormExtendedInfo(r.data.data[0].extendedInfo);
    }
  };
  useEffect(() => {
    fetchSurrogate();
  }, []);

  const getExtendedInfoValue = (field) => {
    const filter = surrogateFormExtendedInfo.filter(
      (info) => info.field === field
    );
    if (filter.length === 0) {
      return "Not Found";
    } else {
      const info = filter[0];
      return info.value;
    }
  };

  const setExtendedInfoValue = (field, value) => {
    const filter = surrogateFormExtendedInfo.filter(
      (info) => info.field === field
    );
    if (filter.length === 0) {
      console.log("Not found");
      return "Not Found";
    } else {
      let info = filter[0];
      info = { ...info, value: value };
      setSurrogateFormExtendedInfo([
        ...surrogateFormExtendedInfo.filter((i) => i.field !== field),
        info,
      ]);
    }
  };

  useEffect(() => {
    console.log("New extended information", surrogateFormExtendedInfo);
  }, [surrogateFormExtendedInfo]);
  const UpdateSurrogate = async () => {
    console.log(formErrors);
    if (formSubmitting) {
      const errors = Object.values(formErrors).filter((e) => e === true);
      if (errors.length > 0) {
        setFormSubmitting(false);

        addToast("Please fill the form correctly", { appearance: "error" });
      } else {
        const data = {
          surrogateID: surrogateForm.id,
          firstname: surrogateForm.primary.firstname,
          lastname: surrogateForm.primary.lastname,
          email: surrogateForm.primary.email,
          phone: surrogateForm.primary.phone,
          address: surrogateForm.primary.address,
          dateOfBirth: "",
          tribe: surrogateForm.primary.tribe,
          religion: surrogateForm.primary.religion,
          experience: surrogateForm.primary.experience,
          mainImage: surrogateForm.primary.mainImage,
          secondImage: surrogateForm.primary.secondImage,
          nin: surrogateForm.primary.nin,
          bvn: surrogateForm.primary.bvn,
          governmentID: surrogateForm.primary.governmentID,
          nok: {
            fullname: surrogateForm.primary.nok.fullname,
            relationship: surrogateForm.primary.nok.relationship,
            address: surrogateForm.primary.nok.address,
            phone: surrogateForm.primary.nok.phone,
            nin: surrogateForm.primary.nok.nin,
          },
          status: surrogateForm.status,
          extendedInfo: surrogateFormExtendedInfo,
        };
        const updateRequest = await PerformRequest.UpdateSurrogate(data).catch(
          () => {
            setFormSubmitting(false);
          }
        );
        setFormSubmitting(false);
        console.log(updateRequest);
        const { message: responseMessage } = updateRequest.data;
        if (updateRequest.data.status === "failed") {
          addToast(responseMessage, { appearance: "error" });
        } else {
          addToast(responseMessage, { appearance: "success" });
          // setShowConfirmationModal(true);
          // showUpdateSurrogateModal(false);
          ContextConsumer.refetchData();
          fetchSurrogate();
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
            },
            text: "Close",
          }}
          modalLink={{
            text: "Back to Dashboard",
            route: "/dashboard",
          }}
          getConfirmationModalStatus={getConfirmationModalStatus}
        />
      )}

      <>
        <input
          type="file"
          accept=".jpg,  .png"
          ref={primaryImageUploadRef}
          className="modal-image-hide"
          onChange={(e) => {
            console.log(e.target.files);
            const image = e.target.files[0];
            if (image.size > 1547220) {
              fileIsLarge();
            } else {
              UploadSurrogateFile("Primary", image);
            }
          }}
        />
        <input
          type="file"
          accept=".jpg,  .png"
          ref={secondaryImageUploadRef}
          className="modal-image-hide"
          onChange={(e) => {
            console.log(e.target.files);
            const image = e.target.files[0];
            if (image.size > 1547220) {
              fileIsLarge();
            } else {
              UploadSurrogateFile("Secondary", image);
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
            if (file.size > 1547220) {
              fileIsLarge();
            } else {
              UploadSurrogateFile("Government", file);
            }
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
          if (file.size > 1547220) {
            fileIsLarge();
          } else {
            UploadSurrogateFile("Covid", file);
          }
        }}
      />
      {/* <Modal
        open={isModalOpen}
        onClose={(e, reason) => {
          if (reason === "backdropClick") {
            setModalOpen(false);
            showUpdateSurrogateModal(false);
          }
        }}
        className="default-modal-container flex-row"
      > */}
      {/* <div className="default-modal-content modal-scrollbar surrogate-report-modal flex-column"> */}
      <div className="surrogate-content flex-column">
        <span className="cinzel px-30 uppercase">update surrogate profile</span>
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
            <div className="flex-row space-between modal-input-row">
              {/* <DatePicker
                defaultValue={dayjs("2023-01-01")}
                {...defaultFullInputProps}
                error={formErrors.dateOfBirth}
                slotProps={{
                  textField: { variant: "standard" },
                }}
                value={surrogateForm.dateOfBirth}
                onChange={(e) => {
                  setSurrogateForm({
                    ...surrogateForm,
                    dateOfBirth: dayjs(e).format("YYYY-MM-DD"),
                  });
                }}
                label="Date of Birth"
              /> */}

              {/* <FormControl variant="standard" {...defaultHalfInputProps}>
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
              </FormControl> */}
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
                label="Phone Number"
                value={surrogateForm.primary.phone}
                error={formErrors.phone}
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
                label="Email Address"
                value={surrogateForm.primary.email}
                error={formErrors.email}
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
            <div className="flex-row space-between modal-input-row">
              <FormControl variant="standard" {...defaultHalfInputProps}>
                <InputLabel id="demo-simple-select-standard-label">
                  Tribe
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={surrogateForm.primary.tribe}
                  error={formErrors.tribe}
                  onChange={(e) =>
                    setSurrogateForm({
                      ...surrogateForm,
                      primary: {
                        ...surrogateForm.primary,
                        tribe: e.target.value,
                      },
                    })
                  }
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
                  value={surrogateForm.primary.religion}
                  error={formErrors.religion}
                  onChange={(e) =>
                    setSurrogateForm({
                      ...surrogateForm,
                      primary: {
                        ...surrogateForm.primary,
                        religion: e.target.value,
                      },
                    })
                  }
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
                label="NIN"
                value={surrogateForm.primary.nin}
                error={formErrors.nin}
                {...defaultHalfInputProps}
                onChange={(e) =>
                  setSurrogateForm({
                    ...surrogateForm,
                    primary: {
                      ...surrogateForm.primary,
                      nin: e.target.value,
                    },
                  })
                }
              />
              <TextField
                label="BVN"
                value={surrogateForm.primary.bvn}
                error={formErrors.bvn}
                {...defaultHalfInputProps}
                onChange={(e) =>
                  setSurrogateForm({
                    ...surrogateForm,
                    primary: {
                      ...surrogateForm.primary,
                      bvn: e.target.value,
                    },
                  })
                }
              />
            </div>
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
          </div>
        </div>

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
                  value={getExtendedInfoValue("disease")}
                  error={formErrors.disease}
                  onChange={(e) => {
                    setExtendedInfoValue("disease", e.target.value);
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
                  error={formErrors.covidVaccination}
                  value={getExtendedInfoValue("covidVaccination")}
                  onChange={(e) => {
                    setExtendedInfoValue("covidVaccination", e.target.value);
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
                  error={formErrors.firstTimeParent}
                  value={getExtendedInfoValue("firstTimeParent")}
                  onChange={(e) => {
                    setExtendedInfoValue("firstTimeParent", e.target.value);
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
              <DatePicker
                defaultValue={dayjs("2023-01-01")}
                {...defaultHalfInputProps}
                error={formErrors.lastChildBirthTime}
                slotProps={{
                  textField: { variant: "standard" },
                }}
                value={dayjs(getExtendedInfoValue("lastChildBirthTime"))}
                onChange={(e) => {
                  setExtendedInfoValue(
                    "lastChildBirthTime",
                    dayjs(e).format("YYYY-MM-DD")
                  );
                }}
                label="Date of Last Child Birth"
              />
            </div>
            <div className="flex-row space-between modal-input-row">
              <FormControl variant="standard" {...defaultFullInputProps}>
                <InputLabel id="demo-simple-select-standard-label">
                  HIV/AIDS STATUS
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  error={formErrors.hivStatus}
                  value={getExtendedInfoValue("hivStatus")}
                  onChange={(e) => {
                    setExtendedInfoValue("hivStatus", e.target.value);
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
            </div>
            <div className="flex-row space-between modal-input-row">
              <TextField
                label="Next of Kin Full Name"
                value={surrogateForm.primary.nok.fullname}
                error={formErrors.nokFullname}
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
                label="Next of Kin Address"
                value={surrogateForm.primary.nok.address}
                error={formErrors.nokAddress}
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
                error={formErrors.nokPhone}
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
                  error={formErrors.nokRelationship}
                  onChange={(e) =>
                    setSurrogateForm({
                      ...surrogateForm,
                      primary: {
                        ...surrogateForm.primary,
                        nok: {
                          ...surrogateForm.primary.nok,
                          relationship: e.target.value,
                        },
                      },
                    })
                  }
                  label="Relationship to Kin"
                >
                  {ContextConsumer.Relationships.map((rel, index) => {
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
                label="Next of Kin NIN"
                value={surrogateForm.primary.nok.nin}
                error={formErrors.nokNin}
                {...defaultFullInputProps}
                onChange={(e) =>
                  setSurrogateForm({
                    ...surrogateForm,
                    primary: {
                      ...surrogateForm.primary,
                      nok: {
                        ...surrogateForm.primary.nok,
                        nin: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>
            <div className="flex-row space-between modal-input-row">
              <FormControl variant="standard" {...defaultHalfInputProps}>
                <InputLabel id="demo-simple-select-standard-label">
                  Status
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={surrogateForm.status}
                  error={formErrors.status}
                  onChange={(e) =>
                    setSurrogateForm({
                      ...surrogateForm,
                      status: e.target.value,
                    })
                  }
                  label="Status"
                >
                  <MenuItem value={"active"} key={"active"}>
                    Active
                  </MenuItem>
                  <MenuItem value={"inactive"} key={"inactive"}>
                    Inactive
                  </MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Experience"
                value={surrogateForm.primary.experience}
                error={formErrors.experience}
                {...defaultHalfInputProps}
                onChange={(e) =>
                  setSurrogateForm({
                    ...surrogateForm,
                    primary: {
                      ...surrogateForm.primary,
                      experience: e.target.value,
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
                    {surrogateForm.primary.governmentID.length > 0 ? (
                      getFileName(surrogateForm.primary.governmentID)
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
                    {getExtendedInfoValue("covidVaccinationCertificate") ? (
                      getFileName(
                        getExtendedInfoValue("covidVaccinationCertificate")
                      )
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
        </div>
      </div>
    </>
  );
}
