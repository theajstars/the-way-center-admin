import { Modal, TextField } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { UploadFile } from "../../API/FetchData";
import { PerformRequest } from "../../API/PerformRequests";
import { validateEmail } from "../../App";
import ImageSelectorPlaceholder from "../../Assets/IMG/ImageSelectorPlaceholder.svg";
import { validatePhone } from "../../Lib/Validate";
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
  primaryImage: undefined,
  secondaryImage: undefined,
};
export default function ParentRegistration({ showAddParentModal }) {
  const { addToast, removeAllToasts } = useToasts();
  const [isModalOpen, setModalOpen] = useState(true);
  const [parentForm, setParentForm] = useState(initialParentForm);
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
  const fileIsLarge = () => {
    addToast("Max File Size: 1.5MB", { appearance: "error" });
  };
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    spouseFirstName: false,
    spouseLastName: false,

    address: false,
    primaryEmailAddress: false,
    secondaryEmailAddress: false,
    primaryPhone: false,
    secondaryPhone: false,

    primaryImage: false,
    secondaryImage: false,
  });

  const UpdateFormErrors = (action) => {
    const isPrimaryPhoneValid = validatePhone(parentForm.primaryPhone);
    const isSecondaryPhoneValid = validatePhone(parentForm.secondaryPhone);
    const isPrimaryEmailValid = validateEmail(parentForm.primaryEmailAddress);
    const isSecondaryEmailValid = validateEmail(
      parentForm.secondaryEmailAddress
    );

    setFormErrors({
      ...formErrors,
      firstName: parentForm.firstName.length === 0,
      lastName: parentForm.lastName.length === 0,
      spouseFirstName: parentForm.spouseFirstName.length === 0,
      spouseLastName: parentForm.lastName.length === 0,
      address: parentForm.address.length === 0,
      primaryEmailAddress: !isPrimaryEmailValid,
      secondaryEmailAddress: !isSecondaryEmailValid,
      primaryPhone: !isPrimaryPhoneValid,
      secondaryPhone: !isSecondaryPhoneValid,

      primaryImage: !parentForm.primaryImage,
      secondaryImage: !parentForm.secondaryImage,
    });
  };
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const getConfirmationModalStatus = (value) => {
    setShowConfirmationModal(value);
    if (!value) {
      showAddParentModal(false);
    }
  };
  useEffect(() => {
    CreateAccount();
  }, [formErrors]);
  const CreateAccount = async () => {
    console.log(formErrors);
    const errors = Object.values(formErrors).filter((e) => e === true);
    if (errors.length > 0) {
      setFormSubmitting(false);

      addToast("Please fill the form correctly", { appearance: "error" });
    } else {
      let primaryImageFormData = new FormData();
      primaryImageFormData.append(
        "file",
        parentForm.primaryImage,
        parentForm.primaryImage.name
          .toLowerCase()
          .split(" ")
          .join()
          .replaceAll(",", "")
      );
      let secondaryImageFormData = new FormData();
      secondaryImageFormData.append(
        "file",
        parentForm.secondaryImage,
        parentForm.secondaryImage.name
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
      const data = {
        address: parentForm.address,
        primary: {
          firstname: parentForm.firstName,
          lastname: parentForm.lastName,
          email: parentForm.primaryEmailAddress,
          phone: parentForm.primaryPhone,
          image: uploadPrimaryImage.data.fileUrl,
        },
        spouse: {
          firstname: parentForm.spouseFirstName,
          lastname: parentForm.spouseLastName,
          email: parentForm.secondaryEmailAddress,
          phone: parentForm.secondaryPhone,
          image: uploadSecondaryImage.data.fileUrl,
        },
      };

      const createParent = await PerformRequest.CreateNewParent(data);
      setFormSubmitting(false);
      removeAllToasts();
      console.log(createParent);
      const { message: responseMessage } = createParent.data;
      if (createParent.data.status === "failed") {
        addToast(responseMessage, { appearance: "error" });
      } else {
        addToast(responseMessage, { appearance: "success" });
        window.location.reload();
      }
      // setShowConfirmationModal(true);
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
        accept=".jpg, .png"
        ref={primaryImageUploadRef}
        className="modal-image-hide"
        onChange={(e) => {
          console.log(e.target.files);
          const image = e.target.files[0];
          if (image.size > 1547220) {
            fileIsLarge();
          } else {
            setParentForm({ ...parentForm, primaryImage: image });
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
            setParentForm({ ...parentForm, secondaryImage: image });
          }
        }}
      />
      <Modal
        open={isModalOpen}
        onClose={(e, reason) => {
          if (reason === "backdropClick") {
            setModalOpen(false);
            showAddParentModal(false);
          }
        }}
        className="default-modal-container flex-row"
      >
        <div className="default-modal-content modal-scrollbar surrogate-report-modal flex-column">
          <span className="cinzel px-30 uppercase">create parent account</span>
          <br />
          <span className="modal-about poppins px-15">
            Fill in the data for parent profile correctly. It will take a couple
            of minutes
          </span>

          <div className="modal-form-container flex-row">
            <div className="modal-form flex-column">
              <br />
              <span className="fw-600 poppins px-24">Parent Bio-Data</span>
              <br />
              <div className="flex-row space-between modal-input-row">
                <TextField
                  label="First Name"
                  {...defaultHalfInputProps}
                  value={parentForm.firstName}
                  error={formErrors.firstName}
                  onChange={(e) =>
                    setParentForm({ ...parentForm, firstName: e.target.value })
                  }
                />
                <TextField
                  label="Last Name"
                  value={parentForm.lastName}
                  error={formErrors.lastName}
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
                  error={formErrors.spouseFirstName}
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
                  error={formErrors.spouseLastName}
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
                  error={formErrors.address}
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
                  error={formErrors.primaryEmailAddress}
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
                  error={formErrors.secondaryEmailAddress}
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
                  error={formErrors.primaryPhone}
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
                  error={formErrors.secondaryPhone}
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
                  {parentForm.primaryImage ? (
                    <img
                      src={URL.createObjectURL(parentForm.primaryImage)}
                      alt=""
                      className="modal-form-image"
                    />
                  ) : (
                    <span className="px-16 poppins">No Image Selected</span>
                  )}
                </div>
                <br />
                <span
                  className="purple-btn-default px-16 poppins pointer width-100"
                  style={{
                    borderColor: formErrors.primaryImage
                      ? "red"
                      : "transparent",
                  }}
                  onClick={() => {
                    primaryImageUploadRef.current.click();
                  }}
                >
                  Upload Image
                </span>
              </span>
              <br />
              <span className="flex-column align-center width-100">
                <div className="modal-form-image-container flex-row">
                  {parentForm.secondaryImage ? (
                    <img
                      src={URL.createObjectURL(parentForm.secondaryImage)}
                      alt=""
                      className="modal-form-image"
                    />
                  ) : (
                    <span className="px-16 poppins">No Image Selected</span>
                  )}
                </div>
                <br />
                <span
                  className="purple-btn-default px-16 poppins pointer width-100"
                  style={{
                    borderColor: formErrors.secondaryImage
                      ? "red"
                      : "transparent",
                  }}
                  onClick={() => {
                    secondaryImageUploadRef.current.click();
                  }}
                >
                  Upload Image
                </span>
              </span>
              <br />
              <button
                disabled={formSubmitting}
                className="purple-btn-default px-16 poppins pointer width-100 uppercase modal-form-submit"
                onClick={() => {
                  UpdateFormErrors();
                  setFormSubmitting(true);
                }}
              >
                Create Account &nbsp;
                {formSubmitting ? (
                  <i className="far fa-spinner-third fa-spin" />
                ) : (
                  <i className="far fa-long-arrow-alt-right" />
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
