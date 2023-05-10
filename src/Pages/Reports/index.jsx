import { Modal, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { useContext } from "react";
import {
  initialParent,
  initialSurrogate,
  RecentParents,
  SurrogateRecords,
  SurrogateReports,
} from "../../Assets/Data";
import { DefaultContext } from "../Dashboard";
import AishaAvatar from "../../Assets/IMG/AishaAvatar.svg";

export default function Reports() {
  const ContextConsumer = useContext(DefaultContext);
  const ModifySurrogatesRef = useRef();
  const [SurrogateRecordsToDisplay, setSurrogateRecordsToDisplay] = useState(
    SurrogateRecords.slice(0, 4)
  );
  const ModifySurrogateRecordsToDisplay = () => {
    if (SurrogateRecordsToDisplay.length === SurrogateRecords.length) {
      setSurrogateRecordsToDisplay(SurrogateRecords.slice(0, 4));
    } else {
      setSurrogateRecordsToDisplay(SurrogateRecords);
    }
  };
  const [isViewSurrogate, setViewSurrogate] = useState(false);

  const showViewSurrogateModal = (value) => {
    setViewSurrogate(value);
  };
  const [surrogateReportModalDetails, setSurrogateReportModalDetails] =
    useState({ state: false, content: null });

  const screenWidth = window.innerWidth;
  console.log(screenWidth);

  const getSurrogateOverviewCount = () => {
    if (screenWidth > 1450) {
      return 3;
    } else {
      return 2;
    }
  };
  return (
    <div className="home-page">
      <Typography className="poppins fw-500" variant="h5">
        ADMIN DASHBOARD
      </Typography>

      {/* <div className="flex-row space-between align-center">
            <span className="poppins fw-500 px-18 surrogate-reports-head">
              Your Surrogate Reports
            </span>
            <span className="poppins fw-500 px-16 purple-default-text view-more-reports">
              View More
            </span>
          </div> */}
      <Modal
        open={surrogateReportModalDetails.state}
        onClose={(e, reason) => {
          if (reason === "backdropClick") {
            setSurrogateReportModalDetails({
              ...surrogateReportModalDetails,
              state: false,
            });
          }
        }}
        className="default-modal-container flex-row"
      >
        <div className="default-modal-content surrogate-report-modal flex-column">
          <div className="flex-row align-center">
            <div className="flex-column">
              <span className="cinzel px-16 gray-secondary-text surrogate-report-type">
                {surrogateReportModalDetails.content?.type}
              </span>
              <span className="cinzel px-19 surrogate-report-title">
                {surrogateReportModalDetails.content?.title}
              </span>
            </div>
            &nbsp; &nbsp; &nbsp;
            <img src={AishaAvatar} alt="" className="surrogate-report-avatar" />
          </div>
          <br />
          <br />
          <span className="fw-700 cinzel px-19">FULL REPORT</span>
          <br />
          <br />
          <span className="px-15 gray-secondary-text poppins full-surrogate-report-body modal-scrollbar">
            {surrogateReportModalDetails.content?.body}
            <br />
            <br />
            {surrogateReportModalDetails.content?.body}
            <br />
            <br />
            {surrogateReportModalDetails.content?.body}
            <br />
            <br />
            {surrogateReportModalDetails.content?.body}
          </span>
          <div className="flex-row surrogate-report-modal-footer">
            <span
              className="close-surrogate-report poppins flex-row pointer"
              onClick={() => {
                setSurrogateReportModalDetails({
                  ...surrogateReportModalDetails,
                  state: false,
                });
              }}
            >
              Exit
            </span>
          </div>
        </div>
      </Modal>
      <div className="surrogate-reports flex-row space-between">
        {SurrogateReports.slice(0, getSurrogateOverviewCount()).map(
          (report, index) => {
            return (
              <div className="surrogate-report flex-column" key={index}>
                <div className="flex-row surrogate-report-top space-between">
                  <div className="flex-column">
                    <span className="cinzel px-14 gray-secondary-text surrogate-report-type">
                      {report.type}
                    </span>
                    <span className="cinzel px-16 surrogate-report-title">
                      {report.title}
                    </span>
                  </div>
                  <img
                    src={AishaAvatar}
                    alt=""
                    className="surrogate-report-avatar"
                  />
                </div>
                <span className="surrogate-report-body poppins px-14 fw-300">
                  {report.body.length > 120
                    ? `${report.body.substring(0, 120)}...`
                    : report.body}
                </span>
                <div className="flex-row space-between">
                  <span className="flex-column">
                    <span
                      className={`surrogate-report-verdict flex-row poppins fw-500 px-13 surrogate-report-${report.verdict.toLowerCase()}`}
                    >
                      {report.verdict}
                    </span>
                    <small className="px-10 fw-500 poppins">
                      Doctor’s Overall Remark
                    </small>
                  </span>

                  <span
                    className="px-14 poppins fw-500 pointer"
                    onClick={() => {
                      setSurrogateReportModalDetails({
                        state: true,
                        content: report,
                      });
                    }}
                  >
                    <u>View Full Report</u>
                  </span>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
