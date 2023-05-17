import { useState, useRef, useContext } from "react";
import {
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { useToasts } from "react-toast-notifications";
import ImageSelectorPlaceholder from "../../Assets/IMG/ImageSelectorPlaceholder.svg";
import Confirmation from "../Confirmation";
import { RecentParents } from "../../Assets/Data";
import { DefaultContext } from "../Dashboard";
import { PerformRequest } from "../../API/PerformRequests";
import { useEffect } from "react";
const initialPairingForm = {
  parentID: "",
  surrogateID: "",
  parentImage: "",
  surrogateImage: "",
  parentName: "",
  surrogateName: "",
};

export default function CreatePairing({ showCreatePairingModal }) {
  const { addToast, removeAllToasts } = useToasts();
  const ConsumerContext = useContext(DefaultContext);
  const [isModalOpen, setModalOpen] = useState(true);
  const [pairingForm, setPairingForm] = useState(initialPairingForm);

  const [surrogates, setSurrogates] = useState([]);
  const [parents, setParents] = useState([]);

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
  const getUnpairedSurrogates = async () => {
    const r = await PerformRequest.GetAllSurrogates({ isPaired: "No" });
    setSurrogates(r.data.data ?? []);
  };
  const getUnpairedParents = async () => {
    const r = await PerformRequest.GetAllParents({ isPaired: "No" });
    setParents(r.data.data ?? []);
  };
  useEffect(() => {
    getUnpairedParents();
    getUnpairedSurrogates();
  }, []);
  const Pair = async () => {
    if (pairingForm.parentID.length > 0 && pairingForm.parentID.length > 0) {
      const pairingRequest = await PerformRequest.CreatePairing(pairingForm);
      console.log(pairingRequest);
      if (pairingRequest.data.status === "success") {
        setShowConfirmationModal(true);
      } else {
        addToast(pairingRequest.data.message, { appearance: "error" });
      }
    }
  };
  return (
    <>
      {showConfirmationModal && (
        <Confirmation
          modalHeaderText={`PARENT <> SURROGATE PAIRING SUCCESSFUL`}
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
                  {parents.length === 0 ? (
                    <Chip
                      label="No Unpaired Parents"
                      color="primary"
                      variant="outlined"
                    />
                  ) : (
                    <>
                      <InputLabel id="demo-simple-select-standard-label">
                        Parent
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={pairingForm.parentID}
                        onChange={(e) => {
                          setPairingForm({
                            ...pairingForm,
                            parentID: e.target.value,
                          });
                        }}
                        label="Parent"
                      >
                        {parents.map((parent, index) => {
                          return (
                            <MenuItem value={parent.id} key={parent.id}>
                              {parent.primary.firstname}{" "}
                              {parent.primary.lastname}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </>
                  )}
                </FormControl>
                <FormControl variant="standard" {...defaultHalfInputProps}>
                  {surrogates.length === 0 ? (
                    <Chip
                      label="No Unpaired Surrogates"
                      color="primary"
                      variant="outlined"
                    />
                  ) : (
                    <>
                      <InputLabel id="demo-simple-select-standard-label">
                        Surrogate
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={pairingForm.surrogateName}
                        onChange={(e) => {
                          setPairingForm({
                            ...pairingForm,
                            surrogateID: e.target.value,
                          });
                        }}
                        label="Surrogate"
                      >
                        {surrogates.map((surrogate, index) => {
                          return (
                            <MenuItem value={surrogate.id} key={surrogate.id}>
                              {surrogate.primary.firstname}{" "}
                              {surrogate.primary.lastname}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </>
                  )}
                </FormControl>
              </div>
            </div>
            <div className="flex-column modal-form-create-pairing-right align-center space-between">
              <span className="flex-column align-center width-100">
                <div className="flex-row space-between align-center width-100">
                  <div className="pairing-item-container flex-column align-center">
                    <div className="modal-form-image-container flex-row">
                      <img
                        src={pairingForm.parentImage}
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
                        src={pairingForm.surrogateImage}
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
              <button
                style={{
                  opacity:
                    pairingForm.parentID.length === 0 ||
                    pairingForm.parentID.length === 0
                      ? "0.5"
                      : "1",
                  cursor:
                    pairingForm.parentID.length === 0 ||
                    pairingForm.parentID.length === 0
                      ? "not-allowed"
                      : "pointer",
                }}
                disabled={
                  pairingForm.parentID.length === 0 ||
                  pairingForm.parentID.length === 0
                }
                className="purple-btn-default px-16 poppins pointer pairing-modal-submit uppercase modal-form-submit"
                onClick={() => {
                  Pair();
                }}
              >
                Create Pairing
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
