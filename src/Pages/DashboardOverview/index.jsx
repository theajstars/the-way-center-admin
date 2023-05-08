import { useState, useContext } from "react";
import CreatePairing from "../CreatePairing";
import { DefaultContext } from "../Dashboard";
import ParentRegistration from "../ParentRegistration";
import SurrogateRegistration from "../SurrogateRegistration";

export default function DashboardOverview() {
  const ContextConsumer = useContext(DefaultContext);
  const [isAddNewParent, setAddNewParent] = useState(false);
  const [isAddNewSurrogate, setAddNewSurrogate] = useState(false);
  const [isAddNewPairing, setAddNewPairing] = useState(false);
  const showAddParentModal = (value) => {
    setAddNewParent(value);
  };
  const showAddSurrogateModal = (value) => {
    setAddNewSurrogate(value);
  };
  const showCreatePairingModal = (value) => {
    setAddNewPairing(value);
  };
  return (
    <div className="flex-row dashboard-blocks">
      <div className="flex-column dashboard-block">
        <span className="cinzel px-28 dashboard-block-header">PARENTS</span>
        <div className="flex-row dashboard-block-footer">
          <span
            className="pointer px-17 fw-500 poppins underline"
            onClick={() => {
              setAddNewParent(true);
            }}
          >
            Add New Parent
          </span>
          {isAddNewParent && (
            <ParentRegistration showAddParentModal={showAddParentModal} />
          )}
          <span className="fw-700 px-40 cinzel">
            {ContextConsumer.Metrics.parent}
          </span>
        </div>
      </div>
      <div className="flex-column dashboard-block">
        <span className="cinzel px-28 dashboard-block-header">SURROGATES</span>
        <div className="flex-row dashboard-block-footer">
          <span
            className="pointer px-17 fw-500 poppins underline"
            onClick={() => {
              setAddNewSurrogate(true);
            }}
          >
            Add New Surrogate
          </span>
          {isAddNewSurrogate && (
            <SurrogateRegistration
              showAddSurrogateModal={showAddSurrogateModal}
            />
          )}
          <span className="fw-700 px-40 cinzel">
            {ContextConsumer.Metrics.surrogate}
          </span>
        </div>
      </div>
      <div className="flex-column dashboard-block">
        <span className="cinzel px-28 dashboard-block-header">PAIRINGS</span>
        <div className="flex-row dashboard-block-footer">
          <span
            className="pointer px-17 fw-500 poppins underline"
            onClick={() => {
              setAddNewPairing(true);
            }}
          >
            Create New Pairings
          </span>
          {isAddNewPairing && (
            <CreatePairing showCreatePairingModal={showCreatePairingModal} />
          )}
          <span className="fw-700 px-40 cinzel">
            {ContextConsumer.Metrics.pairing}
          </span>
        </div>
      </div>
    </div>
  );
}
