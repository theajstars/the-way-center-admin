import { useState, useRef, useContext } from "react";

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
  initialParent,
  NextOfKinRelationships,
  SampleSurrogate,
} from "../../Assets/Data";
import dayjs from "dayjs";
import { useToasts } from "react-toast-notifications";
import Confirmation from "../Confirmation";
import SurrogateUpdate from "../SurrogateUpdate";
import ParentUpdate from "../ParentUpdate";
import { PerformRequest } from "../../API/PerformRequests";
import { DefaultContext } from "../Dashboard";

export default function ParentProfileView({
  showViewParentModal,
  isUpdate,
  parent = initialParent,
}) {
  const ConsumerContext = useContext(DefaultContext);
  const [isModalOpen, setModalOpen] = useState(true);
  const { addToast, removeAllToasts } = useToasts();
  const [currentFormSection, setCurrentFormSection] = useState(1);
  const [parentForm, setParentForm] = useState(parent);
  const primaryImageUploadRef = useRef();
  const secondaryImageUploadRef = useRef();
  console.log(parent);

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

  const getParentSurrogate = () => {
    if (parseInt(parent.pair) === 0) {
      return "Unpaired";
    } else {
    }
  };

  const [isParentStatusToggling, setParentStatusToggling] = useState(false);
  const ActivateParent = async () => {
    removeAllToasts();
    setParentStatusToggling(true);
    const activate = await PerformRequest.UpdateParent({
      ...parentForm,
      parentID: parentForm.id,
      status: "active",
    }).catch(() => {
      setParentStatusToggling(false);
    });
    setParentStatusToggling(false);
    if (activate.data.response_code === 200) {
      addToast("Parent activated!", { appearance: "success" });
      ConsumerContext.refetchData();
      setParentForm({ ...parentForm, status: "active" });
    }
  };
  const DeactivateParent = async () => {
    removeAllToasts();
    setParentStatusToggling(true);
    const deactivate = await PerformRequest.UpdateParent({
      ...parentForm,
      parentID: parentForm.id,
      status: "inactive",
    }).catch(() => {
      setParentStatusToggling(false);
    });
    setParentStatusToggling(false);
    if (deactivate.data.response_code === 200) {
      addToast("Parent Deactivated!", { appearance: "success" });
      ConsumerContext.refetchData();
      setParentForm({ ...parentForm, status: "inactive" });
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
              setParentForm(initialParent);
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
        <ParentUpdate
          showUpdateParentModal={showUpdateParentModal}
          parent={parent}
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
            setParentForm({
              ...parentForm,
              primaryImage: URL.createObjectURL(image),
            });
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
            setParentForm({
              ...parentForm,
              secondaryImage: URL.createObjectURL(image),
            });
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
            setParentForm({
              ...parentForm,
              govtIdentificationFile: file,
            });
          }}
        />
        <input
          type="file"
          accept=".pdf, .jpg,  .png"
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
                    value={`${parent.primary.firstname} ${parent.primary.lastname}`}
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
                    value={`${parent.spouse.firstname} ${parent.spouse.lastname}`}
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
                    value={`${parent.address}`}
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
                    value={`${parent.primary.email}`}
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
                    value={`${parent.spouse.email}`}
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
                    value={`${parent.primary.phone}`}
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
                    value={`${parent.spouse.phone}`}
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
                      parseInt(parent.pair) > 0 ? "Paired" : "Unpaired"
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
                    value={getParentSurrogate()}
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
                  <img
                    src={parent.primary.image}
                    alt=""
                    className="modal-form-image"
                  />
                </div>
                <br />

                <br />
                <div className="modal-form-image-container modal-form-image-container-small flex-row">
                  <img
                    src={parent.spouse.image}
                    alt=""
                    className="modal-form-image"
                  />
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
              onClick={() => {
                parentForm.status === "active"
                  ? DeactivateParent()
                  : ActivateParent();
              }}
            >
              {parentForm.status === "active" ? "Deactivate" : "Activate"}{" "}
              Profile &nbsp;
              {isParentStatusToggling ? (
                <i className="far fa-spinner-third fa-spin" />
              ) : (
                <>
                  {parentForm.status === "active" ? (
                    <i className="far fa-times" />
                  ) : (
                    <i className="far fa-check" />
                  )}{" "}
                </>
              )}
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
