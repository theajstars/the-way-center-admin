import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "@mui/material";

export default function Confirmation({
  modalHeaderText,
  modalAction,
  modalBodyText,
  modalLink,
  isPairing,
  parentName,
  surrogateName,
  getConfirmationModalStatus,
}) {
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(true);

  return (
    <Modal open={isModalOpen} className="default-modal-container flex-row">
      <div className="default-modal-content modal-scrollbar surrogate-report-modal full-border-modal flex-column">
        <div className="confirmation-modal-content flex-column">
          <center>
            <span className="px-30 cinzel uppercase">{modalHeaderText}</span>
          </center>

          <div className="confirmation-modal-body flex-row poppins uppercase">
            {!isPairing ? (
              modalBodyText
            ) : (
              <span>
                {parentName}
                <br />
                <span className="px-14">is now matched with</span>
                <br />
                {surrogateName}
              </span>
            )}
          </div>
          <span
            className="confirmation-modal-action uppercase poppins modal-form-submit flex-row pointer"
            onClick={modalAction.method}
          >
            {modalAction.text}
          </span>
          <span
            className="confirmation-modal-link uppercase poppins underline pointer"
            onClick={() => {
              navigate(modalLink.route);
              getConfirmationModalStatus(false);
            }}
          >
            {modalLink.text}
          </span>
        </div>
      </div>
    </Modal>
  );
}
