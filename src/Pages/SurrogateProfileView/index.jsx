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
  initialSurrogate,
  NextOfKinRelationships,
  SampleSurrogate,
} from "../../Assets/Data";
import dayjs from "dayjs";

import Confirmation from "../Confirmation";
import SurrogateUpdate from "../SurrogateUpdate";
import SurrogateReportCreate from "../SurrogateReportCreate";

export default function SurrogateProfileView({
  showViewSurrogateModal,
  isUpdate,
  surrogate,
}) {
  const [isModalOpen, setModalOpen] = useState(true);

  const [currentFormSection, setCurrentFormSection] = useState(1);
  const [surrogateForm, setSurrogateForm] = useState(surrogate);
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
    disabled: true,
    className: "modal-input-half px-14 black-text",
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
      showViewSurrogateModal(false);
    }
  };

  const [isUpdateProfile, setUpdateProfile] = useState(isUpdate ?? false);

  const showUpdateSurrogateModal = (value) => {
    setUpdateProfile(value);
  };

  const [showCreateReport, setShowCreateReport] = useState(false);
  const showSurrogateReportModal = (value) => {
    setShowCreateReport(value);
    // setModalOpen(false);
    // showUpdateSurrogateModal(false);
    showViewSurrogateModal(false);
  };
  const CreateSurrogateReport = () => {
    setModalOpen(false);
    setShowCreateReport(true);
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
      {isUpdateProfile && (
        <SurrogateUpdate
          showUpdateSurrogateModal={showUpdateSurrogateModal}
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
            setSurrogateForm({
              ...surrogateForm,
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
            setSurrogateForm({
              ...surrogateForm,
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
            setSurrogateForm({
              ...surrogateForm,
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
            setSurrogateForm({
              ...surrogateForm,
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
            showViewSurrogateModal(false);
          }
        }}
        className="default-modal-container flex-row"
      >
        <div className="default-modal-content modal-scrollbar surrogate-report-modal flex-column">
          <span className="cinzel px-30 uppercase">VIEW SURROGATE PROFILE</span>
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
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <Input
                    id="standard-adornment-amount"
                    {...defaultFullInputProps}
                    value={`${surrogate.primary.firstname} ${surrogate.primary.lastname}`}
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
              <div className="flex-row space-between modal-input-row">
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <Input
                    id="standard-adornment-amount"
                    {...defaultFullInputProps}
                    value={`${"true"}`}
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="fw-500 poppins px-15 black-text">
                          Parent Name
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
                    value={`${surrogate.address}`}
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="fw-500 poppins px-15 black-text">
                          Address
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
                    value={`${surrogate.primary.email}`}
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
                    value={`${surrogate.primary.phone}`}
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
                    value={`${
                      parseInt(surrogate.pair) > 0 ? "Paired" : "Unpaired"
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
                <FormControl
                  fullWidth
                  sx={{ m: 1 }}
                  variant="standard"
                  {...defaultHalfInputProps}
                >
                  <Input
                    id="standard-adornment-amount"
                    value={`${surrogate.primary.hairColor}`}
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="fw-500 poppins px-15 black-text">
                          Hair Color
                        </span>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  sx={{ m: 1 }}
                  variant="standard"
                  {...defaultHalfInputProps}
                >
                  <Input
                    id="standard-adornment-amount"
                    value={`${surrogate.primary.skinColor}`}
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="fw-500 poppins px-15 black-text">
                          Skin Color
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
                    src={surrogate.primary.mainImage}
                    alt=""
                    className="modal-form-image"
                  />
                </div>
                <br />

                <br />
                <div className="modal-form-image-container modal-form-image-container-small flex-row">
                  <img
                    src={surrogate.primary.secondImage}
                    alt=""
                    className="modal-form-image"
                  />
                </div>
                <br />
              </span>
              <br />
              <div className="flex-column">
                <Button
                  variant="contained"
                  onClick={CreateSurrogateReport}
                  fullWidth
                >
                  Create Report
                </Button>

                <br />
                <span
                  className="purple-btn-default px-16 poppins pointer width-100 uppercase modal-form-submit surrogate-form-btn"
                  onClick={() => {
                    showViewSurrogateModal(false);
                  }}
                >
                  Exit Profile
                </span>
              </div>
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
