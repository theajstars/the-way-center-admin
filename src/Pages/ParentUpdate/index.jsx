import { Modal, TextField } from "@mui/material";
import { useState, useRef } from "react";
import ImageSelectorPlaceholder from "../../Assets/IMG/ImageSelectorPlaceholder.svg";
import Confirmation from "../Confirmation";

const initialParentForm = {
  firstName: "",
  lastName: "",
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
  const [isModalOpen, setModalOpen] = useState(true);
  const [parentForm, setParentForm] = useState(initialParentForm);
  const imageUploadRef = useRef();
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
      showUpdateParentModal(false);
    }
  };
  return (
    <>
      {showConfirmationModal && (
        <Confirmation
          modalHeaderText="ACCOUNT CREATED SUCCESSFULLY"
          modalBodyText="Email with secured login information has been sent to primary email"
          modalAction={{
            method: () => {
              setShowConfirmationModal(false);
              setModalOpen(true);
              setParentForm(initialParentForm);
            },
            text: "Create Another Account",
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
                  label="Spouse First Name"
                  value={parentForm.spouseFirstName}
                  {...defaultHalfInputProps}
                  onChange={(e) =>
                    setParentForm({
                      ...parentForm,
                      spouseFirstName: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Spouse Last Name"
                  value={parentForm.spouseLastName}
                  {...defaultHalfInputProps}
                  onChange={(e) =>
                    setParentForm({
                      ...parentForm,
                      spouseLastName: e.target.value,
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
                  label="Primary Email Address"
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
                  label="Secondary Email Address"
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
                <TextField
                  label="Primary Phone Number"
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
                  label="Secondary Phone Number"
                  value={parentForm.secondaryPhone}
                  {...defaultFullInputProps}
                  onChange={(e) =>
                    setParentForm({
                      ...parentForm,
                      secondaryPhone: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex-column modal-form-right space-between">
              <span className="flex-column align-center width-100">
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
              </span>
              <br />
              <span
                className="purple-btn-default px-16 poppins pointer width-100 uppercase modal-form-submit"
                onClick={() => {
                  setShowConfirmationModal(true);
                }}
              >
                Create Account
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
