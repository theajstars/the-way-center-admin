import {
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useRef } from "react";
import ImageSelectorPlaceholder from "../../Assets/IMG/ImageSelectorPlaceholder.svg";
import Confirmation from "../Confirmation";
import { RecentParents } from "../../Assets/Data";
const initialPairingForm = {
  parentName: "",
  surrogateName: "",
};
export default function CreatePairing({ showCreatePairingModal }) {
  const [isModalOpen, setModalOpen] = useState(true);
  const [pairingForm, setPairingForm] = useState(initialPairingForm);
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
      showCreatePairingModal(false);
    }
  };
  return (
    <>
      {showConfirmationModal && (
        <Confirmation
          modalHeaderText="PARENT <> SURROGATE PAIRING SUCCESSFUL"
          isPairing={true}
          parentName={pairingForm.parentName}
          surrogateName={pairingForm.surrogateName}
          modalBodyText=""
          modalAction={{
            method: () => {
              setShowConfirmationModal(false);
              setModalOpen(true);
              setPairingForm(initialPairingForm);
            },
            text: "Create Another Pairing",
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
          setPairingForm({ ...pairingForm, image: URL.createObjectURL(image) });
        }}
      />
      <Modal
        open={isModalOpen}
        onClose={(e, reason) => {
          if (reason === "backdropClick") {
            setModalOpen(false);
            showCreatePairingModal(false);
          }
        }}
        className="default-modal-container flex-row"
      >
        <div className="default-modal-content modal-scrollbar surrogate-report-modal flex-column">
          <span className="cinzel px-30 uppercase">
            create parent + surrogate pairing
          </span>
          <br />
          <center>
            <span className="modal-about modal-about-create-pairing poppins px-15">
              Kindly select the parent and the corresponding surrogate
            </span>
          </center>

          <div className="modal-form-create-pairing-container flex-column align-center">
            <div className="modal-form-create-pairing flex-column">
              <br />
              <span className="fw-600 poppins px-24">
                Parent + Surrogate Match
              </span>
              <br />
              <div className="flex-row space-between modal-input-row">
                <FormControl variant="standard" {...defaultHalfInputProps}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Parents Name
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={pairingForm.parentName}
                    onChange={(e) => {
                      setPairingForm({
                        ...pairingForm,
                        parentName: e.target.value,
                      });
                    }}
                    label="Parents Name"
                  >
                    {RecentParents.map((parent, index) => {
                      return (
                        <MenuItem value={parent.name} key={parent.email}>
                          {parent.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl variant="standard" {...defaultHalfInputProps}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Surrogates Name
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={pairingForm.surrogateName}
                    onChange={(e) => {
                      setPairingForm({
                        ...pairingForm,
                        surrogateName: e.target.value,
                      });
                    }}
                    label="Surrogates Name"
                  >
                    {RecentParents.map((surrogate, index) => {
                      return (
                        <MenuItem value={surrogate.name} key={surrogate.email}>
                          {surrogate.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="flex-column modal-form-create-pairing-right align-center space-between">
              <span className="flex-column align-center width-100">
                <div className="flex-row space-between align-center width-100">
                  <div className="pairing-item-container flex-column align-center">
                    <div className="modal-form-image-container flex-row">
                      <img
                        src={
                          pairingForm.parentName.length > 0
                            ? "https://www.w3schools.com/howto/img_avatar.png"
                            : ""
                        }
                        alt=""
                        className="modal-form-image"
                      />
                    </div>
                    <div className="pairing-person-tag poppins px-15">
                      Parent Image
                    </div>
                  </div>
                  <div className="pairing-item-container flex-column align-center">
                    <div className="modal-form-image-container flex-row">
                      <img
                        src={
                          pairingForm.surrogateName.length > 0
                            ? "https://www.w3schools.com/howto/img_avatar.png"
                            : ""
                        }
                        alt=""
                        className="modal-form-image"
                      />
                    </div>
                    <div className="pairing-person-tag poppins px-15">
                      Surrogate Image
                    </div>
                  </div>
                </div>
                <br />
              </span>
              <br />
              <span
                className="purple-btn-default px-16 poppins pointer pairing-modal-submit uppercase modal-form-submit"
                onClick={() => {
                  setShowConfirmationModal(true);
                }}
              >
                Create Pairing
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
