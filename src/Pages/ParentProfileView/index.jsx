import { useState, useRef } from "react";

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
} from "@mui/material";
import ImageSelectorPlaceholder from "../../Assets/IMG/ImageSelectorPlaceholder.svg";
import { DateField, DatePicker } from "@mui/x-date-pickers";
import {
  CountriesList,
  CovidVaccinationDosage,
  Diseases,
  NextOfKinRelationships,
  SampleSurrogate,
} from "../../Assets/Data";
import dayjs from "dayjs";

import Confirmation from "../Confirmation";
import SurrogateUpdate from "../SurrogateUpdate";
import ParentUpdate from "../ParentUpdate";

const initialParentForm = {
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
export default function ParentProfileView({ showViewParentModal, isUpdate }) {
  const [isModalOpen, setModalOpen] = useState(true);

  const [currentFormSection, setCurrentFormSection] = useState(1);
  const [parentForm, setParentForm] = useState(initialParentForm);
  const primaryImageUploadRef = useRef();
  const secondaryImageUploadRef = useRef();

  const govtIdentificationUploadRef = useRef();
  const covidVaccinationUploadRef = useRef();
  const defaultFullInputProps = {
    disabled: true,
    className: "black-text",
    // className: "modal-input-full px-14",
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
      showViewParentModal(false);
    }
  };

  const [isUpdateProfile, setUpdateProfile] = useState(isUpdate ?? false);

  const showUpdateParentModal = (value) => {
    setUpdateProfile(value);
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
              setParentForm(initialParentForm);
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
      {isUpdateProfile && (
        <ParentUpdate showUpdateParentModal={showUpdateParentModal} />
      )}
      <>
        <input
          type="file"
          accept=".pdf, .jpg, .jpeg, .png"
          ref={primaryImageUploadRef}
          className="modal-image-hide"
          onChange={(e) => {
            console.log(e.target.files);
            const image = e.target.files[0];
            setParentForm({
              ...parentForm,
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
            setParentForm({
              ...parentForm,
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
            setParentForm({
              ...parentForm,
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
            setParentForm({
              ...parentForm,
              covidVaccinationFile: file,
            });
          }}
        />
      </>
      <Modal
        open={isModalOpen}
        onClose={(e, reason) => {
          if (reason === "backdropClick") {
            setModalOpen(false);
            showViewParentModal(false);
          }
        }}
        className="default-modal-container flex-row"
      >
        <div className="default-modal-content modal-scrollbar surrogate-report-modal flex-column">
          <span className="cinzel px-30 uppercase">VIEW PARENT PROFILE</span>
          <br />

          <div className="modal-form-container flex-row">
            <div className="modal-form flex-column">
              <div className="flex-row space-between modal-input-row">
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <Input
                    id="standard-adornment-amount"
                    {...defaultFullInputProps}
                    value={`${SampleSurrogate.firstName} ${SampleSurrogate.lastName}`}
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="fw-500 poppins px-15 black-text">
                          Parent
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
                    value={`${SampleSurrogate.spouseName}`}
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="fw-500 poppins px-15 black-text">
                          Parent's Spouse Name
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
                    value={`${SampleSurrogate.address}`}
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="fw-500 poppins px-15 black-text">
                          Parent's Address
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
                    value={`${SampleSurrogate.primaryEmailAddress}`}
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
                    value={`${SampleSurrogate.secondaryEmailAddress}`}
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="fw-500 poppins px-15 black-text">
                          Secondary Email Address
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
                    value={`${SampleSurrogate.primaryPhone}`}
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
                    value={`${SampleSurrogate.primaryPhone}`}
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="fw-500 poppins px-15 black-text">
                          Secondary Phone Number
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
                      SampleSurrogate.pair.length > 0 ? "Paired" : "Unpaired"
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
                    value={`${SampleSurrogate.firstName} ${SampleSurrogate.lastName}`}
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="fw-500 poppins px-15 black-text">
                          Surrogate
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
                  {parentForm.primaryImage.length > 0 ? (
                    // Image is set

                    <img
                      src={parentForm.primaryImage}
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
                {/* <span
                  className="purple-btn-default px-16 poppins pointer width-100 surrogate-form-btn"
                  onClick={() => {
                    primaryImageUploadRef.current.click();
                  }}
                >
                  Upload Main Image
                </span> */}
                <br />
                <div className="modal-form-image-container modal-form-image-container-small flex-row">
                  {parentForm.secondaryImage.length > 0 ? (
                    // Image is set

                    <img
                      src={parentForm.secondaryImage}
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
                {/* <span
                  className="purple-btn-default px-16 poppins pointer width-100 surrogate-form-btn"
                  onClick={() => {
                    secondaryImageUploadRef.current.click();
                  }}
                >
                  Upload Second Image
                </span> */}
              </span>
              <br />
              <span
                className="purple-btn-default px-16 poppins pointer width-100 uppercase modal-form-submit surrogate-form-btn"
                onClick={() => {
                  showViewParentModal(false);
                }}
              >
                Exit Profile
              </span>
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
                setUpdateProfile(true);
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
      </Modal>
    </>
  );
}
