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

const initialParentForm = {
  firstName: "Mike Hugh",
  lastName: "Chalk",
  spouseFirstName: "",
  spouseLastName: "",
  address: "",
  primaryEmailAddress: "",
  secondaryEmailAddress: "",
  primaryPhone: "",
  secondaryPhone: "",
  image: "",
};
export default function ParentUpdate({ showUpdateParentModal }) {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(true);
  const [parentForm, setParentForm] = useState(initialParentForm);
  const imageUploadRef = useRef();
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
              setParentForm(initialParentForm);
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
        ref={imageUploadRef}
        className="modal-image-hide"
        onChange={(e) => {
          console.log(e.target.files);
          const image = e.target.files[0];
          setParentForm({ ...parentForm, image: URL.createObjectURL(image) });
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
            <div className="modal-form flex-column">
              <br />
              <span className="fw-600 poppins px-24">Parent Bio-Data</span>
              <br />
              <div className="flex-row space-between modal-input-row">
                <TextField
                  label="First Name"
                  value={parentForm.firstName}
                  {...defaultHalfInputProps}
                  onChange={(e) =>
                    setParentForm({ ...parentForm, firstName: e.target.value })
                  }
                />
                <TextField
                  label="Last Name"
                  value={parentForm.lastName}
                  {...defaultHalfInputProps}
                  onChange={(e) =>
                    setParentForm({ ...parentForm, lastName: e.target.value })
                  }
                />
              </div>
              <div className="flex-row space-between modal-input-row">
                <TextField
                  label="Email"
                  value={parentForm.primaryEmailAddress}
                  {...defaultFullInputProps}
                  onChange={(e) =>
                    setParentForm({
                      ...parentForm,
                      primaryEmailAddress: e.target.value,
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
                    setParentForm({ ...parentForm, address: e.target.value })
                  }
                />
              </div>
              <div className="flex-row space-between modal-input-row">
                <TextField
                  label="Address"
                  value={parentForm.primaryPhone}
                  {...defaultFullInputProps}
                  onChange={(e) =>
                    setParentForm({
                      ...parentForm,
                      primaryPhone: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex-row space-between modal-input-row">
                <TextField
                  label="Address"
                  value={parentForm.secondaryEmailAddress}
                  {...defaultFullInputProps}
                  onChange={(e) =>
                    setParentForm({
                      ...parentForm,
                      secondaryEmailAddress: e.target.value,
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
                    // value={surrogateForm.placeOfBirth}
                    // onChange={(e) => {
                    //   setSurrogateForm({
                    //     ...surrogateForm,
                    //     placeOfBirth: e.target.value,
                    //   });
                    // }}
                    label="Contact Class"
                  >
                    <MenuItem value={"Nobody knboww"} key={"Nobody knboww"}>
                      Shish Kebab
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
                    // value={surrogateForm.placeOfBirth}
                    // onChange={(e) => {
                    //   setSurrogateForm({
                    //     ...surrogateForm,
                    //     placeOfBirth: e.target.value,
                    //   });
                    // }}
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
            <div className="flex-column modal-form-right space-between">
              {/* <span className="flex-column align-center width-100">
                <div className="modal-form-image-container flex-row">
                  {parentForm.image.length > 0 ? (
                    // Image is set

                    <img
                      src={parentForm.image}
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
                  className="purple-btn-default px-16 poppins pointer width-100"
                  onClick={() => {
                    imageUploadRef.current.click();
                  }}
                >
                  Upload Image
                </span>
              </span> */}
              <br />
            </div>
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
                  {initialParentForm.image ? (
                    initialParentForm.image.length
                  ) : (
                    <span>No File Selected</span>
                  )}
                </div>
                <span
                  className="px-13 poppins fw-500 modal-form-file-btn flex-row pointer"
                  onClick={() => {
                    imageUploadRef.current.click();
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
          </div>
        </div>
      </Modal>
    </>
  );
}
