import { useState, useRef } from "react";

import { useNavigate } from "react-router-dom";

import {
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import ImageSelectorPlaceholder from "../../Assets/IMG/ImageSelectorPlaceholder.svg";
import Confirmation from "../Confirmation";

import { initialParent } from "../../Assets/Data";

export default function ParentUpdate({
  showUpdateParentModal,
  parent = initialParent,
}) {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(true);
  const [parentForm, setParentForm] = useState({
    ...parent,
    primary: { ...parent.primary, image: undefined },
    spouse: { ...parent.spouse, image: undefined },
  });

  const [currentContact, setCurrentContact] = useState("Spouse");

  const primaryImageUploadRef = useRef();
  const spouseImageUploadRef = useRef();
  const defaultFullInputProps = {
    variant: "outlined",
    spellCheck: false,
    className: "modal-input-full px-14",
  };
  const defaultHalfInputProps = {
    ...defaultFullInputProps,
    className: "modal-input-half px-14",
  };

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const getConfirmationModalStatus = (value) => {
    setShowConfirmationModal(value);
    if (!value) {
      showUpdateParentModal(false);
    }
  };
  return (
    <>
      {showConfirmationModal && (
        <Confirmation
          modalHeaderText="PROFILE UPDATED SUCCESSFULLY"
          modalBodyText="Parent profile has been updated and saved!"
          modalAction={{
            method: () => {
              setShowConfirmationModal(false);
              setModalOpen(true);
              setParentForm(initialParent);
              navigate("/dashboard/parents");
            },
            text: "Parents",
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
        accept=".jpg, .jpeg, .png"
        ref={primaryImageUploadRef}
        className="modal-image-hide"
        onChange={(e) => {
          console.log(e.target.files);
          const image = e.target.files[0];
          setParentForm({
            ...parentForm,
            primary: { ...parentForm.primary, image: image },
          });
        }}
      />
      <input
        type="file"
        accept=".jpg, .jpeg, .png"
        ref={spouseImageUploadRef}
        className="modal-image-hide"
        onChange={(e) => {
          console.log(e.target.files);
          const image = e.target.files[0];
          setParentForm({
            ...parentForm,
            spouse: { ...parentForm.spouse, image: image },
          });
        }}
      />

      <Modal
        open={isModalOpen}
        onClose={(e, reason) => {
          if (reason === "backdropClick") {
            setModalOpen(false);
            showUpdateParentModal(false);
          }
        }}
        className="default-modal-container flex-row"
      >
        <div className="default-modal-content modal-scrollbar surrogate-report-modal flex-column">
          <span className="cinzel px-30 uppercase">update parent profile</span>
          <br />

          <div className="modal-form-container flex-column align-center">
            {currentContact === "Primary" ? (
              <>
                <div className="modal-form flex-column">
                  <br />
                  <span className="fw-600 poppins px-24">Parent Bio-Data</span>
                  <br />
                  <div className="flex-row space-between modal-input-row">
                    <TextField
                      label="First Name"
                      value={parentForm.primary.firstname}
                      {...defaultHalfInputProps}
                      onChange={(e) =>
                        setParentForm({
                          ...parentForm,
                          primary: {
                            ...parentForm.primary,
                            firstname: e.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      label="Last Name"
                      value={parentForm.primary.lastname}
                      {...defaultHalfInputProps}
                      onChange={(e) =>
                        setParentForm({
                          ...parentForm,
                          primary: {
                            ...parentForm.primary,
                            lastname: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="flex-row space-between modal-input-row">
                    <TextField
                      label="Email"
                      value={parentForm.primary.email}
                      {...defaultFullInputProps}
                      onChange={(e) =>
                        setParentForm({
                          ...parentForm,
                          primary: {
                            ...parentForm.primary,
                            email: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="flex-row space-between modal-input-row">
                    <TextField
                      label="Address"
                      value={parentForm.address}
                      {...defaultFullInputProps}
                      onChange={(e) =>
                        setParentForm({
                          ...parentForm,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex-row space-between modal-input-row">
                    <TextField
                      label="Phone Number"
                      value={parentForm.primary.phone}
                      {...defaultFullInputProps}
                      onChange={(e) =>
                        setParentForm({
                          ...parentForm,
                          primary: {
                            ...parentForm.primary,
                            phone: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="flex-row space-between modal-input-row">
                    <FormControl variant="standard" {...defaultHalfInputProps}>
                      <InputLabel id="demo-simple-select-standard-label">
                        Contact Class
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        label="Contact Class"
                        value={currentContact}
                        onChange={(e) => {
                          setCurrentContact(e.target.value);
                        }}
                      >
                        <MenuItem value={"Primary"} key={"Primary"}>
                          Primary
                        </MenuItem>
                        <MenuItem value={"Spouse"} key={"Spouse"}>
                          Spouse
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl variant="standard" {...defaultHalfInputProps}>
                      <InputLabel id="demo-simple-select-standard-label">
                        Status
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        label="Status"
                      >
                        <MenuItem value={true} key={"Active"}>
                          Active
                        </MenuItem>
                        <MenuItem value={false} key={"Inactive"}>
                          Inactive
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <br />
                <br />

                <br />
                <div
                  className="flex-column modal-form-file-container"
                  style={{
                    width: 300,
                  }}
                >
                  <span className="px-13 poppins fw-500">
                    &nbsp; &nbsp; Upload Photo
                  </span>
                  <div className="flex-row modal-form-file ">
                    <div className="px-13 poppins fw-500">
                      {parentForm.primary.image ? (
                        URL.createObjectURL(parentForm.primary.image)
                      ) : (
                        <span>No File Selected</span>
                      )}
                    </div>
                    <span
                      className="px-13 poppins fw-500 modal-form-file-btn flex-row pointer"
                      onClick={() => {
                        primaryImageUploadRef.current.click();
                      }}
                    >
                      Upload File
                    </span>
                  </div>
                  <span className="px-13 poppins fw-500 modal-form-file-about">
                    &nbsp; &nbsp; Acceptable format :JPG/PNG
                  </span>
                </div>

                <br />
                <div className="flex-row width-100 align-center space-between">
                  <Button
                    variant="outlined"
                    style={{
                      borderColor: "rgba(162, 89, 255, 0.42)",
                      borderWidth: "2px",
                      color: "#000",
                    }}
                    onClick={() => {
                      showUpdateParentModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <span
                    className="purple-btn-default px-16 poppins pointer uppercase modal-form-submit"
                    onClick={() => {
                      setShowConfirmationModal(true);
                    }}
                  >
                    Update Profile
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="modal-form flex-column">
                  <br />
                  <span className="fw-600 poppins px-24">Spouse Bio-Data</span>
                  <br />
                  <div className="flex-row space-between modal-input-row">
                    <TextField
                      label="Spouse First Name"
                      value={parentForm.spouse.firstname}
                      {...defaultHalfInputProps}
                      onChange={(e) =>
                        setParentForm({
                          ...parentForm,
                          spouse: {
                            ...parentForm.spouse,
                            firstname: e.target.value,
                          },
                        })
                      }
                    />
                    <TextField
                      label="Spouse Last Name"
                      value={parentForm.spouse.lastname}
                      {...defaultHalfInputProps}
                      onChange={(e) =>
                        setParentForm({
                          ...parentForm,
                          spouse: {
                            ...parentForm.spouse,
                            lastname: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="flex-row space-between modal-input-row">
                    <TextField
                      label="Spouse Email"
                      value={parentForm.spouse.email}
                      {...defaultFullInputProps}
                      onChange={(e) =>
                        setParentForm({
                          ...parentForm,
                          spouse: {
                            ...parentForm.spouse,
                            email: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="flex-row space-between modal-input-row">
                    <TextField
                      label="Address"
                      value={parentForm.address}
                      {...defaultFullInputProps}
                      onChange={(e) =>
                        setParentForm({
                          ...parentForm,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex-row space-between modal-input-row">
                    <TextField
                      label="Spouse Phone Number"
                      value={parentForm.spouse.phone}
                      {...defaultFullInputProps}
                      onChange={(e) =>
                        setParentForm({
                          ...parentForm,
                          spouse: {
                            ...parentForm.spouse,
                            phone: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="flex-row space-between modal-input-row">
                    <FormControl variant="standard" {...defaultHalfInputProps}>
                      <InputLabel id="demo-simple-select-standard-label">
                        Contact Class
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        label="Contact Class"
                        value={currentContact}
                        onChange={(e) => {
                          setCurrentContact(e.target.value);
                        }}
                      >
                        <MenuItem value={"Primary"} key={"Primary"}>
                          Primary
                        </MenuItem>
                        <MenuItem value={"Spouse"} key={"Spouse"}>
                          Spouse
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl variant="standard" {...defaultHalfInputProps}>
                      <InputLabel id="demo-simple-select-standard-label">
                        Status
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        label="Status"
                      >
                        <MenuItem value={true} key={"Active"}>
                          Active
                        </MenuItem>
                        <MenuItem value={false} key={"Inactive"}>
                          Inactive
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <br />
                <br />

                <br />

                <div
                  className="flex-column modal-form-file-container"
                  style={{
                    width: 300,
                  }}
                >
                  <span className="px-13 poppins fw-500">
                    &nbsp; &nbsp; Upload Photo
                  </span>
                  <div className="flex-row modal-form-file ">
                    <div className="px-13 poppins fw-500">
                      {parentForm.spouse.image ? (
                        URL.createObjectURL(parentForm.spouse.image)
                      ) : (
                        <span>No File Selected</span>
                      )}
                    </div>
                    <span
                      className="px-13 poppins fw-500 modal-form-file-btn flex-row pointer"
                      onClick={() => {
                        spouseImageUploadRef.current.click();
                      }}
                    >
                      Upload File
                    </span>
                  </div>
                  <span className="px-13 poppins fw-500 modal-form-file-about">
                    &nbsp; &nbsp; Acceptable format :JPG/PNG
                  </span>
                </div>

                <br />
                <div className="flex-row width-100 align-center space-between">
                  <Button
                    variant="outlined"
                    style={{
                      borderColor: "rgba(162, 89, 255, 0.42)",
                      borderWidth: "2px",
                      color: "#000",
                    }}
                    onClick={() => {
                      showUpdateParentModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <span
                    className="purple-btn-default px-16 poppins pointer uppercase modal-form-submit"
                    onClick={() => {
                      setShowConfirmationModal(true);
                    }}
                  >
                    Update Profile
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
